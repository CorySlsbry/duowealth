-- ============================================================
-- Refer-2-Friends system
--
-- Flow:
--   1. Every user gets a unique referral_code on first login
--      (trigger on auth.users).
--   2. Visitors land with ?ref=CODE, we POST /api/referrals/track
--      which stores a click row + sets a cookie.
--   3. When the visitor signs up, POST /api/referrals/apply links
--      the new auth user to the referrer (status='pending').
--   4. When the new user's first invoice.payment_succeeded webhook
--      fires, we call qualify_referral() to flip the row to
--      'qualified'.
--   5. The moment a referrer hits 2 qualified referrals, we mark
--      their profile.reward_unlocked=true. The Stripe webhook
--      then attaches the REFER2_20OFF coupon to their active
--      subscription. Idempotent — only ever applies once.
--
-- Runs inside a per-app schema (duowealth, scanzen, calmkids,
-- memori). Replace duowealth before applying.
-- ============================================================

set local search_path = duowealth, public;

-- 1. Referral codes (one per user, auto-generated)
create table if not exists duowealth.referral_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  created_at timestamptz not null default now()
);

-- 2. Referral tracking rows
-- referrer_user_id -> referee_user_id once signup lands.
-- status: 'pending' | 'qualified' | 'void'
create table if not exists duowealth.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  referee_user_id uuid references auth.users(id) on delete set null,
  referee_email text,
  code text not null,
  status text not null default 'pending' check (status in ('pending','qualified','void')),
  qualified_at timestamptz,
  stripe_invoice_id text,
  created_at timestamptz not null default now(),
  unique (referee_user_id)
);

create index if not exists referrals_referrer_idx
  on duowealth.referrals (referrer_user_id, status);

-- 3. Referral clicks (pre-signup visits — optional analytics)
create table if not exists duowealth.referral_clicks (
  id bigserial primary key,
  code text not null,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- 4. User reward ledger (did we already apply the 20% off?)
create table if not exists duowealth.referral_rewards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  qualified_count int not null default 0,
  unlocked_at timestamptz,
  stripe_coupon_applied_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text
);

-- ============================================================
-- Helper: generate short human-friendly code like "7G4K-R2NM"
-- ============================================================
create or replace function duowealth.generate_referral_code(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = duowealth, public, pg_temp
as $$
declare
  v_code text;
  v_attempts int := 0;
begin
  loop
    v_code := upper(
      substr(encode(gen_random_bytes(3), 'hex'), 1, 4) || '-' ||
      substr(encode(gen_random_bytes(3), 'hex'), 1, 4)
    );
    begin
      insert into duowealth.referral_codes (user_id, code)
      values (p_user_id, v_code)
      on conflict (user_id) do nothing;
      exit;
    exception when unique_violation then
      v_attempts := v_attempts + 1;
      if v_attempts > 5 then
        raise exception 'Could not generate unique referral code';
      end if;
    end;
  end loop;

  return (select code from duowealth.referral_codes where user_id = p_user_id);
end;
$$;

-- ============================================================
-- Helper: link a signup to a referrer (called from /api/referrals/apply)
-- ============================================================
create or replace function duowealth.apply_referral(
  p_referee_user_id uuid,
  p_code text,
  p_referee_email text default null
)
returns jsonb
language plpgsql
security definer
set search_path = duowealth, public, pg_temp
as $$
declare
  v_referrer_id uuid;
begin
  -- Reject self-referrals and unknown codes
  select user_id into v_referrer_id
  from duowealth.referral_codes
  where code = upper(p_code);

  if v_referrer_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unknown_code');
  end if;

  if v_referrer_id = p_referee_user_id then
    return jsonb_build_object('ok', false, 'reason', 'self_referral');
  end if;

  -- Already attributed? keep the first link
  if exists (select 1 from duowealth.referrals where referee_user_id = p_referee_user_id) then
    return jsonb_build_object('ok', false, 'reason', 'already_attributed');
  end if;

  insert into duowealth.referrals (referrer_user_id, referee_user_id, referee_email, code, status)
  values (v_referrer_id, p_referee_user_id, p_referee_email, upper(p_code), 'pending');

  return jsonb_build_object('ok', true, 'referrer_user_id', v_referrer_id);
end;
$$;

-- ============================================================
-- Helper: qualify a referral when referee pays their first invoice
-- Called from the Stripe webhook handler.
-- Returns { ok, referrer_user_id, qualified_count, just_unlocked }
-- where just_unlocked=true means the caller should attach the
-- 20% coupon to the referrer's Stripe subscription.
-- ============================================================
create or replace function duowealth.qualify_referral(
  p_referee_user_id uuid,
  p_stripe_invoice_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = duowealth, public, pg_temp
as $$
declare
  v_ref duowealth.referrals%rowtype;
  v_count int;
  v_reward duowealth.referral_rewards%rowtype;
  v_just_unlocked boolean := false;
begin
  select * into v_ref
  from duowealth.referrals
  where referee_user_id = p_referee_user_id
    and status = 'pending'
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_pending_referral');
  end if;

  update duowealth.referrals
  set status = 'qualified',
      qualified_at = now(),
      stripe_invoice_id = coalesce(p_stripe_invoice_id, stripe_invoice_id)
  where id = v_ref.id;

  select count(*) into v_count
  from duowealth.referrals
  where referrer_user_id = v_ref.referrer_user_id
    and status = 'qualified';

  insert into duowealth.referral_rewards (user_id, qualified_count)
  values (v_ref.referrer_user_id, v_count)
  on conflict (user_id) do update
    set qualified_count = excluded.qualified_count;

  select * into v_reward
  from duowealth.referral_rewards
  where user_id = v_ref.referrer_user_id;

  if v_count >= 2 and v_reward.unlocked_at is null then
    update duowealth.referral_rewards
    set unlocked_at = now()
    where user_id = v_ref.referrer_user_id;
    v_just_unlocked := true;
  end if;

  return jsonb_build_object(
    'ok', true,
    'referrer_user_id', v_ref.referrer_user_id,
    'qualified_count', v_count,
    'just_unlocked', v_just_unlocked,
    'already_applied', v_reward.stripe_coupon_applied_at is not null
  );
end;
$$;

-- Mark coupon applied (called after Stripe API succeeds)
create or replace function duowealth.mark_referral_coupon_applied(
  p_user_id uuid,
  p_customer_id text,
  p_subscription_id text
)
returns void
language sql
security definer
set search_path = duowealth, public, pg_temp
as $$
  update duowealth.referral_rewards
  set stripe_coupon_applied_at = now(),
      stripe_customer_id = p_customer_id,
      stripe_subscription_id = p_subscription_id
  where user_id = p_user_id;
$$;

-- ============================================================
-- Auto-generate referral code on first sign-in
-- (trigger on auth.users)
-- ============================================================
create or replace function duowealth.handle_new_user_referral_code()
returns trigger
language plpgsql
security definer
set search_path = duowealth, public, pg_temp
as $$
begin
  perform duowealth.generate_referral_code(new.id);
  return new;
end;
$$;

-- Each app needs its own trigger name so they don't collide
drop trigger if exists on_auth_user_created_duowealth_referral on auth.users;
create trigger on_auth_user_created_duowealth_referral
  after insert on auth.users
  for each row execute function duowealth.handle_new_user_referral_code();

-- ============================================================
-- RLS
-- ============================================================
alter table duowealth.referral_codes     enable row level security;
alter table duowealth.referrals          enable row level security;
alter table duowealth.referral_clicks    enable row level security;
alter table duowealth.referral_rewards   enable row level security;

-- Users can read their own code
drop policy if exists "own referral code" on duowealth.referral_codes;
create policy "own referral code" on duowealth.referral_codes
  for select using (auth.uid() = user_id);

-- Users can see referrals where they're the referrer
drop policy if exists "own referrals" on duowealth.referrals;
create policy "own referrals" on duowealth.referrals
  for select using (auth.uid() = referrer_user_id);

-- Users can see their own reward row
drop policy if exists "own reward" on duowealth.referral_rewards;
create policy "own reward" on duowealth.referral_rewards
  for select using (auth.uid() = user_id);

-- Clicks are write-only from the anon role (via API route), no select
drop policy if exists "no clicks read" on duowealth.referral_clicks;
create policy "no clicks read" on duowealth.referral_clicks
  for select using (false);

grant usage on schema duowealth to anon, authenticated, service_role;
grant select on duowealth.referral_codes, duowealth.referrals, duowealth.referral_rewards to authenticated;
grant insert on duowealth.referral_clicks to anon, authenticated;
grant execute on function duowealth.apply_referral(uuid, text, text) to authenticated, service_role;
grant execute on function duowealth.qualify_referral(uuid, text) to service_role;
grant execute on function duowealth.mark_referral_coupon_applied(uuid, text, text) to service_role;
