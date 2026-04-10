import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const metadata: Metadata = { title: 'Welcome to DuoWealth!' };

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-dark mb-4">Welcome to DuoWealth!</h1>
        <p className="text-text-secondary mb-8">
          Your 14-day free trial has started. Invite your partner and start building your shared financial future.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-left">
          <p className="font-semibold text-dark mb-4">Next steps</p>
          <ul className="space-y-3">
            {[
              'Invite your partner',
              'Add your accounts',
              'Set your first shared goal',
              'Create a monthly budget',
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-text-secondary">
                <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition min-h-tap w-full"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
