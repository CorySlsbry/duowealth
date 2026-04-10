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
import { createClient } from '@supabase/supabase-js';

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

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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
        if (session.mode !== 'subscription' || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id || '';

        await upsertSubscription({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          priceId,
          status: subscription.status,
          currentPeriodEnd: (subscription as any).current_period_end,
        });

        console.log(`✓ checkout.session.completed: ${subscription.id}`);
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
