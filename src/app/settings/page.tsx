import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Settings — DuoWealth' };

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition">← Dashboard</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-dark mb-8">Settings</h1>
        <div className="space-y-4">
          {[
            { label: 'Account', desc: 'Email, password, profile' },
            { label: 'Partner', desc: 'Manage couple connection' },
            { label: 'Notifications', desc: 'Alerts and reminders' },
            { label: 'Billing', desc: 'Manage subscription' },
            { label: 'Privacy', desc: 'Account privacy settings' },
          ].map(({ label, desc }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between min-h-tap">
              <div>
                <p className="font-semibold text-dark">{label}</p>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
              <span className="text-slate-300">›</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
