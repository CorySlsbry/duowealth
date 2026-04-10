import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Budget — DuoWealth' };

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition">← Dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Monthly Budget</h1>
        <p className="text-text-secondary mb-8">Set spending limits for each category — both partners see the same numbers.</p>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-text-secondary">
          <p className="mb-2 font-medium">Budget categories loading…</p>
          <p className="text-sm">Connect your account to start categorizing expenses together.</p>
        </div>
      </main>
    </div>
  );
}
