"use client";

import { useState } from "react";
import { useReferral } from "@/hooks/use-referral";

export function ReferralCard() {
  const { state, loading, error } = useReferral();
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-12 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (error || !state.code) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          {error ? `Referrals unavailable: ${error}` : "Sign in to see your referral link."}
        </p>
      </div>
    );
  }

  const progress = Math.min(state.qualifiedCount, 2);
  const percent = (progress / 2) * 100;

  async function copy() {
    await navigator.clipboard.writeText(state.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Refer 2 friends, get 20% off forever</h3>
          <p className="mt-1 text-sm text-gray-600">
            Share your link. When 2 friends start a paid plan, we lock in a 20% lifetime discount on your subscription.
          </p>
        </div>
        {state.rewardApplied ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            20% APPLIED
          </span>
        ) : state.unlocked ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            UNLOCKED — APPLYING
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {progress} of 2 friends subscribed
          </span>
          <span>{state.qualifiedCount > 2 ? `+${state.qualifiedCount - 2} bonus` : ""}</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={state.shareUrl}
          className="min-h-11 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={copy}
          className="min-h-11 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Your code: <span className="font-mono font-semibold text-gray-700">{state.code}</span>
      </p>
    </div>
  );
}
