/**
 * DuoWealth — Core TypeScript types
 */

export interface Couple {
  id: string;
  name: string | null;
  invite_code: string | null;
  created_at: string;
}

export interface CoupleMember {
  id: string;
  couple_id: string;
  user_id: string;
  role: 'primary' | 'partner';
  display_name: string | null;
  monthly_income: number | null;
  joined_at: string;
}

export interface Account {
  id: string;
  couple_id: string;
  owner_user_id: string | null;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'other';
  balance: number;
  is_joint: boolean;
  institution_name: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  couple_id: string;
  account_id: string | null;
  owner_user_id: string | null;
  amount: number;
  description: string | null;
  category: string | null;
  is_joint: boolean;
  date: string;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
}

export interface BudgetCategory {
  id: string;
  couple_id: string;
  name: string;
  allocated_amount: number;
  period: 'weekly' | 'monthly' | 'annual';
  color: string | null;
  icon: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  couple_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  icon: string | null;
  color: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface Bill {
  id: string;
  couple_id: string;
  name: string;
  amount: number;
  due_day: number | null;
  split_type: 'equal' | 'proportional' | 'fixed';
  partner1_amount: number | null;
  partner2_amount: number | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  couple_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string | null;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | null;
  current_period_end: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}
