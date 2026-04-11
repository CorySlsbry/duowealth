/**
 * DuoWealth — Stripe lazy singleton
 * Import `stripe` anywhere — instantiated once on first use.
 */

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' as any });
  }
  return _stripe;
}

/**
 * Idempotent: ensures a 20%-off-forever coupon exists in Stripe with the given id.
 * First call on a fresh Stripe account creates it; subsequent calls are no-ops.
 * Used by the referral flow so the 20% discount can be applied at checkout
 * without a manual dashboard step.
 */
const _ensuredCoupons = new Set<string>();
export async function ensureReferralCoupon(stripe: Stripe, couponId: string): Promise<void> {
  if (_ensuredCoupons.has(couponId)) return;
  try {
    await stripe.coupons.retrieve(couponId);
    _ensuredCoupons.add(couponId);
    return;
  } catch (err: any) {
    if (err?.statusCode !== 404 && err?.code !== 'resource_missing') {
      throw err;
    }
  }
  // Create with the fixed id so it's stable across redeploys.
  await stripe.coupons.create({
    id: couponId,
    percent_off: 20,
    duration: 'forever',
    name: 'Refer 2 Friends — 20% Off Forever',
    metadata: { source: 'refer2_flow' },
  });
  _ensuredCoupons.add(couponId);
}
