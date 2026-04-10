# DuoWealth

> The budgeting app built for two — see every dollar, goal, and bill together.

DuoWealth helps couples stop fighting about money and start winning together. Real-time shared dashboard, joint goals, bill splitting, expense categorization, debt payoff tracker, and more — all synced between partners instantly.

## Pricing

- **Monthly**: $5.99/mo per couple
- **Annual**: $59/yr per couple (save $11.88)
- 14-day free trial, cancel anytime, 30-day money-back guarantee

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth + Postgres + RLS)
- **Stripe** (Subscriptions, 14-day trial, Customer Portal)
- **Tailwind CSS** (mobile-first, WCAG AA)
- **Capacitor** (Android/Play Store via WebView)
- **Vercel** (deploy target)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/CorySlsbry/duowealth
cd duowealth
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys.

### 3. Supabase migrations

```bash
supabase db push
```

### 4. Stripe setup

```bash
npx tsx scripts/setup-stripe.ts
```

### 5. Run locally

```bash
npm run dev
```

## Play Store

See `PLAY_STORE_DEPLOYMENT.md` for Android/Play Store build instructions.

## Stripe

See `STRIPE_SETUP.md` for Stripe configuration.
