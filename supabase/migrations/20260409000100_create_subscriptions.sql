-- DuoWealth: Subscriptions table
-- Tracks Stripe subscription state per couple

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  status text not null, -- trialing, active, past_due, canceled
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists subscriptions_couple_id_idx on subscriptions(couple_id);
create index if not exists subscriptions_stripe_customer_id_idx on subscriptions(stripe_customer_id);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

-- RLS
alter table subscriptions enable row level security;

-- Couples can read their own subscription
create policy "subscriptions_select" on subscriptions for select
  using (couple_id = get_my_couple_id());

-- Service role inserts/updates via webhook (no user RLS needed for writes)
create policy "subscriptions_service_upsert" on subscriptions
  for all
  using (true)
  with check (true);
