# Vercel Environment Variables for DuoWealth

Add these to your Vercel project at: https://vercel.com/[your-team]/duowealth/settings/environment-variables

Or via CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# etc.
```

## Required Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | Supabase project URL (Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon key (Settings > API) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role key — keep secret! |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe secret key — use live key in prod |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe webhook endpoint config |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe publishable key |
| `STRIPE_PRICE_MONTHLY` | `price_xxx` | Monthly $5.99 price ID from Stripe |
| `STRIPE_PRICE_ANNUAL` | `price_xxx` | Annual $59 price ID from Stripe |
| `NEXT_PUBLIC_APP_URL` | `https://duowealth.app` | Your production domain |

## Optional Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `RESEND_API_KEY` | `re_...` | For transactional emails (Resend.com) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | For AI budgeting features |

## CLI Commands (copy-paste)
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PRICE_MONTHLY
vercel env add STRIPE_PRICE_ANNUAL
vercel env add NEXT_PUBLIC_APP_URL
```
