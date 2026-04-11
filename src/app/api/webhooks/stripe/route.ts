/**
 * DuoWealth — Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Events handled:
 *   checkout.session.completed
 *   customer.subscription.created
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';
import { enrollInGhl } from '@/lib/ghl';

export const dynamic = 'force-dynamic';

// Lazy init — avoids "apiKey not provided" error at build time
let _stripe: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }
  return _stripe;
}
const stripe = {
  webhooks: { constructEvent: (...args: any[]) => getStripeClient().webhooks.constructEvent(...args as [any, any, any]) },
  subscriptions: { retrieve: (id: string) => getStripeClient().subscriptions.retrieve(id) },
};

async function upsertSubscription(params: {
  coupleId?: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  priceId: string;
  status: string;
  currentPeriodEnd: number;
}) {
  const supabase = createAdminClient();
  const { coupleId, stripeCustomerId, stripeSubscriptionId, priceId, status, currentPeriodEnd } = params;

  let resolvedCoupleId = coupleId;

  if (!resolvedCoupleId) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('couple_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .maybeSingle();
    resolvedCoupleId = existing?.couple_id;
  }

  if (!resolvedCoupleId) {
    console.warn(`No couple_id found for customer ${stripeCustomerId}`);
    return;
  }

  await supabase
    .from('subscriptions')
    .upsert(
      {
        couple_id: resolvedCoupleId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        price_id: priceId,
        status,
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_subscription_id' }
    );
}

/**
 * Get-or-create a Supabase auth user + couple + couple_member binding for
 * the customer email coming from a Stripe checkout. Returns the resolved
 * couple_id (used for the subscription upsert) and a one-time password
 * setup link the user can click from the welcome email.
 */
async function provisionCoupleForCheckout(
  email: string,
  fullName: string
): Promise<{ coupleId?: string; setupLink?: string }> {
  const supabase = createAdminClient();
  try {
    // 1. Get-or-create auth user
    let userId: string | undefined;
    let isNewUser = false;
    const { data: existing } = await (supabase.auth as any).admin.getUserByEmail(email);
    if (existing?.user?.id) {
      userId = existing.user.id;
    } else {
      const { data: created, error: createErr } = await (supabase.auth as any).admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName || '' },
      });
      if (createErr || !created?.user?.id) {
        console.error('[webhook] auth.createUser failed:', createErr?.message);
        return {};
      }
      userId = created.user.id;
      isNewUser = true;
    }

    // 2. Find or create the couple by checking couple_members
    let coupleId: string | undefined;
    const { data: member } = await (supabase as any)
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (member?.couple_id) {
      coupleId = member.couple_id;
    } else {
      const { data: couple, error: coupleErr } = await (supabase as any)
        .from('couples')
        .insert({ name: fullName ? `${fullName}'s couple` : 'New couple' })
        .select('id')
        .single();
      if (coupleErr || !couple?.id) {
        console.error('[webhook] couples.insert failed:', coupleErr?.message);
        return {};
      }
      coupleId = couple.id;
      const { error: memberErr } = await (supabase as any).from('couple_members').insert({
        couple_id: coupleId,
        user_id: userId,
        role: 'primary',
      });
      if (memberErr) {
        console.error('[webhook] couple_members.insert failed:', memberErr.message);
      }
    }

    // 3. Generate password setup link (only for newly-created users). The
    // callback will exchange the code for a session, then route the user to
    // /reset-password where they pick their initial password.
    let setupLink: string | undefined;
    if (isNewUser) {
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ''}/auth/callback?next=/reset-password`;
      const { data: linkData } = await (supabase.auth as any).admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });
      setupLink = linkData?.properties?.action_link || undefined;
    }

    return { coupleId, setupLink };
  } catch (err: any) {
    console.error('[webhook] provisionCoupleForCheckout error:', err?.message);
    return {};
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          session.customer_email || session.customer_details?.email || undefined;
        const customerName = session.customer_details?.name || '';

        // Provision the auth user + couple before writing the subscription
        let coupleId: string | undefined;
        let setupLink: string | undefined;
        if (customerEmail) {
          const result = await provisionCoupleForCheckout(customerEmail, customerName);
          coupleId = result.coupleId;
          setupLink = result.setupLink;
        }

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price.id || '';

          await upsertSubscription({
            coupleId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            priceId,
            status: subscription.status,
            currentPeriodEnd: (subscription as any).current_period_end,
          });

          console.log(`✓ checkout.session.completed: ${subscription.id}`);
        }

        // Welcome email + GHL enrollment (fire-and-forget)
        if (customerEmail) {
          const [firstName, ...rest] = (customerName || '').split(' ');
          const lastName = rest.join(' ') || undefined;

          sendWelcomeEmail(customerEmail, firstName || '', setupLink).catch((e) =>
            console.error('[webhook] welcome email failed:', e?.message || e)
          );

          enrollInGhl({
            email: customerEmail,
            firstName: firstName || undefined,
            lastName,
            priceId: session.metadata?.priceId || undefined,
            stripeCustomerId: session.customer as string,
            metadata: {
              schema: process.env.NEXT_PUBLIC_APP_SCHEMA || 'duowealth',
              checkoutSessionId: session.id,
              refCode: (session.metadata as any)?.refCode || '',
            },
          }).catch((e) => console.error('[webhook] GHL enroll failed:', e?.message || e));
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id || '';

        await upsertSubscription({
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          priceId,
          status: subscription.status,
          currentPeriodEnd: (subscription as any).current_period_end,
        });

        console.log(`✓ ${event.type}: ${subscription.id} → ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }

      default:
        break;
    }
  } catch (error: any) {
    console.error(`Error handling ${event.type}:`, error.message);
  }

  return NextResponse.json({ received: true });
}
