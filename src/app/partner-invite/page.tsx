import type { Metadata } from 'next';
import Link from 'next/link';
import { Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Invite Partner — DuoWealth' };

export default function PartnerInvitePage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-4">Invite Your Partner</h1>
        <p className="text-text-secondary mb-8">
          Send your partner an invite link to connect your accounts and start budgeting together.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <p className="text-sm text-text-secondary mb-3">Your invite link</p>
          <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-text-primary font-mono break-all">
            duowealth.vercel.app/join?code=...
          </div>
          <button className="mt-4 w-full py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-700 transition min-h-tap">
            Copy Invite Link
          </button>
        </div>
        <Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
