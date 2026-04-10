import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Goals — DuoWealth' };

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition">← Dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Joint Goals</h1>
        <p className="text-text-secondary mb-8">Vacation fund, house down payment, emergency fund — track them together.</p>
        <div className="space-y-4">
          {['Emergency Fund', 'Vacation', 'House Down Payment', 'Date-Night Fund'].map(goal => (
            <div key={goal} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-dark">{goal}</p>
                <span className="text-sm text-text-secondary">$0 / $—</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
