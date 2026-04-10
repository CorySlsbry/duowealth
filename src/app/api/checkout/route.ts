/**
 * DuoWealth — Stripe Checkout Session
 * POST /api/checkout
 *
 * Body: { priceId }
 * Returns: { url } — redirect browser to Stripe Checkout
 * Trial: 14 days
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }
  return _stripe;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://duowealth.vercel.app';

const VALID_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_MONTHLY,
  process.env.STRIPE_PRICE_ANNUAL,
].filter(Boolean));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body as { priceId?: string };

    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 });
    }

    if (VALID_PRICE_IDS.size > 0 && !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    let customerEmail: string | undefined;
    let customerId: string | undefined;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        customerEmail = user.email;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('stripe_customer_id')
          .eq('couple_id', user.id)
          .maybeSingle();

        if (sub?.stripe_customer_id) {
          customerId = sub.stripe_customer_id;
        }
      }
    } catch {
      // Auth lookup failed — proceed as guest checkout
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing`,
      subscription_data: {
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 });
  }
}
