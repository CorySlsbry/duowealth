# Stripe Setup — DuoWealth

## 1. Create Stripe account and get API keys

Go to https://dashboard.stripe.com and create an account.

Copy your keys to `.env.local`:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 2. Create products and prices

```bash
npx tsx scripts/setup-stripe.ts
```

Copy the printed price IDs into `.env.local`:
```
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
```

## 3. Set up webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **Endpoint URL**: `https://duowealth.vercel.app/api/webhooks/stripe`
- **Events to listen to**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

Copy the webhook signing secret to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Enable Customer Portal

Go to https://dashboard.stripe.com/settings/billing/portal and enable it.

## 5. Test locally with Stripe CLI

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
