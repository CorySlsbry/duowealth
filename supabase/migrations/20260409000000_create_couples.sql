-- DuoWealth: Core couples schema
-- RLS scopes all data to couple_id via couple_members lookup

-- Couples
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz default now()
);

-- Couple members (each user belongs to one couple)
create table if not exists couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('primary', 'partner')) default 'partner',
  joined_at timestamptz default now(),
  unique(couple_id, user_id),
  unique(user_id) -- a user can only be in one couple
);

-- Accounts (joint or individual)
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  owner_user_id uuid references auth.users(id), -- null = joint
  name text not null,
  type text check (type in ('checking', 'savings', 'credit', 'investment', 'other')) default 'checking',
  balance numeric(12,2) default 0,
  is_joint boolean default true,
  created_at timestamptz default now()
);

-- Transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  account_id uuid references accounts(id) on delete set null,
  logged_by uuid references auth.users(id),
  amount numeric(12,2) not null,
  description text,
  category text,
  date date default current_date,
  is_split boolean default false,
  split_partner_share numeric(5,2), -- percentage owed by partner
  created_at timestamptz default now()
);

-- Budget categories
create table if not exists budget_categories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  name text not null,
  monthly_limit numeric(12,2) default 0,
  emoji text,
  created_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  target_date date,
  emoji text,
  created_at timestamptz default now()
);

-- Bills
create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  name text not null,
  amount numeric(12,2) not null,
  due_day int check (due_day between 1 and 31),
  split_type text check (split_type in ('50_50', 'percentage', 'one_partner')) default '50_50',
  partner_1_share numeric(5,2) default 50,
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- Helper function: get couple_id for authenticated user
create or replace function get_my_couple_id()
returns uuid
language sql
security definer
stable
as $$
  select couple_id from couple_members where user_id = auth.uid() limit 1;
$$;

-- RLS
alter table couples enable row level security;
alter table couple_members enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table budget_categories enable row level security;
alter table goals enable row level security;
alter table bills enable row level security;

-- couples: members can read their own couple
create policy "couples_select" on couples for select
  using (id = get_my_couple_id());

-- couple_members: members can see their couple's members
create policy "couple_members_select" on couple_members for select
  using (couple_id = get_my_couple_id());

create policy "couple_members_insert" on couple_members for insert
  with check (user_id = auth.uid());

-- accounts
create policy "accounts_select" on accounts for select
  using (couple_id = get_my_couple_id());

create policy "accounts_insert" on accounts for insert
  with check (couple_id = get_my_couple_id());

create policy "accounts_update" on accounts for update
  using (couple_id = get_my_couple_id());

-- transactions
create policy "transactions_select" on transactions for select
  using (couple_id = get_my_couple_id());

create policy "transactions_insert" on transactions for insert
  with check (couple_id = get_my_couple_id());

create policy "transactions_update" on transactions for update
  using (couple_id = get_my_couple_id());

-- budget_categories
create policy "budget_categories_all" on budget_categories
  using (couple_id = get_my_couple_id());

-- goals
create policy "goals_all" on goals
  using (couple_id = get_my_couple_id());

-- bills
create policy "bills_all" on bills
  using (couple_id = get_my_couple_id());
