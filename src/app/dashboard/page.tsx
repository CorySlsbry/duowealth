import type { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, Target, Receipt, TrendingDown, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — DuoWealth',
  description: "Your couple's shared financial overview",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">
          <span className="text-primary">Duo</span><span className="text-dark">Wealth</span>
        </span>
        <Link href="/settings" className="text-sm text-text-secondary hover:text-primary transition">Settings</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Your Couple Dashboard</h1>
        <p className="text-text-secondary mb-8">Both partners · Real-time sync</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Net Worth', value: '$—', icon: DollarSign },
            { label: 'Monthly Budget', value: '$—', icon: Target },
            { label: 'Bills Due', value: '—', icon: Receipt },
            { label: 'Debt Remaining', value: '$—', icon: TrendingDown },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-text-secondary mb-1">{label}</p>
              <p className="text-xl font-bold text-dark">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/budget', label: 'Budget', desc: 'Monthly categories', icon: DollarSign },
            { href: '/goals', label: 'Goals', desc: 'Joint savings goals', icon: Target },
            { href: '/bills', label: 'Bills', desc: 'Split bills', icon: Receipt },
            { href: '/transactions', label: 'Transactions', desc: 'All spending', icon: TrendingDown },
            { href: '/partner-invite', label: 'Invite Partner', desc: 'Connect your partner', icon: Users },
          ].map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-primary transition min-h-tap"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-dark">{label}</p>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
