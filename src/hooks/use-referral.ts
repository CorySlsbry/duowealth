"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export type ReferralState = {
  code: string | null;
  qualifiedCount: number;
  unlocked: boolean;
  rewardApplied: boolean;
  shareUrl: string;
};

const EMPTY: ReferralState = {
  code: null,
  qualifiedCount: 0,
  unlocked: false,
  rewardApplied: false,
  shareUrl: "",
};

export function useReferral() {
  const [state, setState] = useState<ReferralState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState(EMPTY);
        setError(null);
        return;
      }
      const res = await fetch("/api/referrals/status", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to load referrals");
      setState(json.state as ReferralState);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchState();
  }, [fetchState]);

  return { state, loading, error, refresh: fetchState };
}
