/**
 * DuoWealth — Idempotent Stripe product + price setup
 * Run: npx tsx scripts/setup-stripe.ts
 *
 * Creates (or reuses) DuoWealth product with Monthly ($5.99) and Annual ($59) prices.
 * Prints price IDs to add to .env.local
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

async function findOrCreateProduct(): Promise<string> {
  const products = await stripe.products.list({ limit: 100 });
  const existing = products.data.find(p => p.name === 'DuoWealth' && p.active);

  if (existing) {
    console.log(`✓ Product already exists: ${existing.id}`);
    return existing.id;
  }

  const product = await stripe.products.create({
    name: 'DuoWealth',
    description: 'The budgeting app built for two — shared dashboard, bill splitting, joint goals, real-time sync.',
    metadata: { app: 'duowealth' },
  });

  console.log(`✓ Created product: ${product.id}`);
  return product.id;
}

async function findOrCreatePrice(
  productId: string,
  nickname: string,
  unitAmount: number,
  interval: 'month' | 'year'
): Promise<string> {
  const prices = await stripe.prices.list({ product: productId, limit: 100 });
  const existing = prices.data.find(
    p =>
      p.nickname === nickname &&
      p.unit_amount === unitAmount &&
      p.recurring?.interval === interval &&
      p.active
  );

  if (existing) {
    console.log(`✓ Price already exists (${nickname}): ${existing.id}`);
    return existing.id;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: unitAmount,
    recurring: { interval },
    nickname,
  });

  console.log(`✓ Created price (${nickname}): ${price.id}`);
  return price.id;
}

async function main() {
  console.log('Setting up DuoWealth Stripe products...\n');

  const productId = await findOrCreateProduct();
  const monthlyPriceId = await findOrCreatePrice(productId, 'Monthly', 599, 'month');
  const annualPriceId = await findOrCreatePrice(productId, 'Annual', 5900, 'year');

  console.log('\n✅ Done! Add these to your .env.local:\n');
  console.log(`STRIPE_PRICE_MONTHLY=${monthlyPriceId}`);
  console.log(`STRIPE_PRICE_ANNUAL=${annualPriceId}`);
  console.log('\nThen set up the webhook at:');
  console.log('https://dashboard.stripe.com/webhooks');
  console.log('Endpoint: https://duowealth.vercel.app/api/webhooks/stripe');
  console.log('Events: checkout.session.completed, customer.subscription.*, invoice.payment_failed');
}

main().catch(console.error);
