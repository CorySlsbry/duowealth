/**
 * ReferralModal — "2 friend emails for 20% off for life" prompt.
 * Shared component across all 4 apps. Dark, neutral theme so it reads
 * on top of every brand.
 *
 * On submit:
 *   1. POST /api/referrals/send-invites  → creates invites + sends friend emails
 *   2. Set ref_code cookie (90 days)
 *   3. POST /api/checkout  with applyReferralDiscount=true → redirect to Stripe
 */
'use client';

import { useState, type FormEvent } from 'react';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function isEmail(s: string) { return EMAIL_RE.test(s.trim()); }

export interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
  priceId: string | null;
  appName: string;
  ctaLabel?: string;
}

export function ReferralModal({ open, onClose, priceId, appName, ctaLabel }: ReferralModalProps) {
  const [yourEmail, setYourEmail] = useState('');
  const [friend1, setFriend1] = useState('');
  const [friend2, setFriend2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !priceId) return null;

  function validate(): string | null {
    if (!isEmail(yourEmail)) return 'Enter a valid email for yourself.';
    if (!isEmail(friend1)) return 'Friend 1 email looks wrong.';
    if (!isEmail(friend2)) return 'Friend 2 email looks wrong.';
    const norm = (s: string) => s.trim().toLowerCase();
    if (norm(friend1) === norm(friend2)) return 'Both friend emails are the same.';
    if (norm(friend1) === norm(yourEmail) || norm(friend2) === norm(yourEmail)) {
      return "You can't refer yourself.";
    }
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);

    try {
      const sendRes = await fetch('/api/referrals/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviterEmail: yourEmail.trim(),
          friendEmails: [friend1.trim(), friend2.trim()],
        }),
      });
      const sendJson = await sendRes.json();
      if (!sendRes.ok) throw new Error(sendJson?.error || 'Failed to send invites');
      const code: string = sendJson.code;

      document.cookie = `ref_code=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;

      const coRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          refCode: code,
          customerEmail: yourEmail.trim(),
          applyReferralDiscount: true,
        }),
      });
      const coJson = await coRes.json();
      if (!coRes.ok || !coJson?.url) throw new Error(coJson?.error || 'Checkout failed');

      window.location.href = coJson.url;
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      setLoading(false);
    }
  }

  async function onSkip() {
    setError(null);
    setLoading(true);
    try {
      const coRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const coJson = await coRes.json();
      if (!coRes.ok || !coJson?.url) throw new Error(coJson?.error || 'Checkout failed');
      window.location.href = coJson.url;
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#111118] border border-[#2a2a3a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <div className="inline-block text-xs font-semibold tracking-wide uppercase text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded">
            Unlock 20% off for life
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white">Share {appName} with 2 friends</h2>
          <p className="mt-2 text-sm text-neutral-400">
            They get 20% off too — forever. Enter their emails and we&apos;ll send them your invite.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Your email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-[#1a1a24] border border-[#2a2a3a] px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Friend 1 email</label>
            <input
              type="email"
              required
              value={friend1}
              onChange={(e) => setFriend1(e.target.value)}
              placeholder="friend1@example.com"
              className="w-full rounded-lg bg-[#1a1a24] border border-[#2a2a3a] px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Friend 2 email</label>
            <input
              type="email"
              required
              value={friend2}
              onChange={(e) => setFriend2(e.target.value)}
              placeholder="friend2@example.com"
              className="w-full rounded-lg bg-[#1a1a24] border border-[#2a2a3a] px-3 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 transition"
          >
            {loading ? 'Sending…' : (ctaLabel || 'Send invites & continue to checkout')}
          </button>

          <p className="text-xs text-neutral-500 text-center">
            No spam. Your friends get one email from us on your behalf.
          </p>

          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="w-full text-xs text-neutral-500 hover:text-neutral-300 py-1 transition disabled:opacity-40"
          >
            Skip referral — pay full price
          </button>
        </form>
      </div>
    </div>
  );
}
