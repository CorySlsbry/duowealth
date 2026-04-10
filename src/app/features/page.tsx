import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, DollarSign, Target, Receipt, Zap, TrendingDown, Calendar, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features — DuoWealth',
  description: 'Everything DuoWealth includes: shared dashboard, bill splitting, joint goals, real-time sync, debt payoff tracker, and more.',
};

const features = [
  {
    icon: Users,
    title: 'Shared Couple Dashboard',
    desc: 'Both partners see every account, budget, and transaction in one place. No more separate spreadsheets or end-of-month surprises.',
  },
  {
    icon: Zap,
    title: 'Real-Time Partner Sync',
    desc: 'When one partner logs a purchase, the other sees it instantly. Always on the same page — literally.',
  },
  {
    icon: Receipt,
    title: 'Bill Splitting',
    desc: 'Split any bill by 50/50, custom percentage, or exact amounts. Track who owes what without the awkward conversations.',
  },
  {
    icon: Target,
    title: 'Joint Goals',
    desc: 'Set savings goals together — vacation, house, emergency fund, date-night fund. Watch the progress bar move as a team.',
  },
  {
    icon: DollarSign,
    title: 'Expense Categorization',
    desc: 'Every transaction is auto-categorized. Both partners see where the money is going without manual entry.',
  },
  {
    icon: TrendingDown,
    title: 'Debt Payoff Tracker',
    desc: 'Visualize your debt-free date using avalanche or snowball method. Track every payment together.',
  },
  {
    icon: Calendar,
    title: 'Date-Night Fund',
    desc: 'A dedicated budget bucket so date nights never get sacrificed for "being responsible."',
  },
  {
    icon: Shield,
    title: 'Emergency Fund Auto-Allocation',
    desc: 'Set a percentage and DuoWealth auto-allocates it to your emergency fund each month.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-surface py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block font-bold text-xl mb-8">
            <span className="text-primary">Duo</span><span className="text-dark">Wealth</span>
          </Link>
          <h1 className="text-fluid-3xl font-bold text-dark mb-4">Features built for couples</h1>
          <p className="text-text-secondary text-fluid-base max-w-xl mx-auto">
            Not a repurposed personal finance app. Every feature is designed for two people managing money together.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-bold text-dark text-lg mb-2">{title}</h2>
              <p className="text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center bg-primary text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-primary-700 transition min-h-tap"
          >
            Start Free Trial
          </Link>
          <p className="text-sm text-text-secondary mt-3">$5.99/mo per couple · 14-day trial · 30-day money-back</p>
        </div>
      </div>
    </div>
  );
}
