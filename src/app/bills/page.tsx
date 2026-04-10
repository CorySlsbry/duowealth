import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Bills — DuoWealth' };

export default function BillsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition">← Dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-2">Bills & Splits</h1>
        <p className="text-text-secondary mb-8">Split any bill by amount, percentage, or 50/50. Both partners see what&apos;s due.</p>
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-text-secondary">
          <p className="mb-2 font-medium">No bills added yet</p>
          <p className="text-sm">Add your first shared bill — rent, utilities, subscriptions, etc.</p>
        </div>
      </main>
    </div>
  );
}
