/**
 * DuoWealth — Stripe Customer Portal
 * POST /api/portal
 *
 * Returns { url } — redirect to Stripe billing portal
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://duowealth.vercel.app';

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('couple_id', user.id)
      .maybeSingle();

    if (subError || !sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${APP_URL}/dashboard`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'No portal URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Failed to create portal session' }, { status: 500 });
  }
}
