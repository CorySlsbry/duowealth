// ============================================================
// Referrals library — shared across all 4 apps.
//
// Usage:
//   - getReferralState(userId)     → current user's code + count + unlocked flag
//   - trackReferralClick(code)     → record a pre-signup visit
//   - applyReferralOnSignup(u, c)  → link new user to referrer
//   - qualifyAndReward(refereeId)  → called from Stripe webhook on first paid invoice
//
// The 20% discount is attached to the REFERRER's subscription
// via a Stripe coupon (REFER2_20OFF) the moment they hit 2
// qualified referrals. Idempotent — stripe_coupon_applied_at
// gates the API call.
// ============================================================

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const SCHEMA = process.env.APP_SCHEMA || "public";
const COUPON_ID = process.env.STRIPE_REFERRAL_COUPON_ID || "REFER2_20OFF";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: SCHEMA }, auth: { persistSession: false } }
  );
}

function stripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
  });
}

export type ReferralState = {
  code: string | null;
  qualifiedCount: number;
  unlocked: boolean;
  rewardApplied: boolean;
  shareUrl: string;
};

export async function getReferralState(userId: string): Promise<ReferralState> {
  const supabase = adminClient();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  const [{ data: codeRow }, { data: rewardRow }] = await Promise.all([
    supabase.from("referral_codes").select("code").eq("user_id", userId).maybeSingle(),
    supabase
      .from("referral_rewards")
      .select("qualified_count, unlocked_at, stripe_coupon_applied_at")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const code = codeRow?.code ?? null;
  return {
    code,
    qualifiedCount: rewardRow?.qualified_count ?? 0,
    unlocked: Boolean(rewardRow?.unlocked_at),
    rewardApplied: Boolean(rewardRow?.stripe_coupon_applied_at),
    shareUrl: code && appUrl ? `${appUrl}/?ref=${code}` : "",
  };
}

export async function trackReferralClick(code: string, ip?: string, userAgent?: string) {
  const supabase = adminClient();
  await supabase.from("referral_clicks").insert({
    code: code.toUpperCase(),
    ip: ip ?? null,
    user_agent: userAgent ?? null,
  });
}

export async function applyReferralOnSignup(
  refereeUserId: string,
  code: string,
  email?: string
) {
  const supabase = adminClient();
  const { data, error } = await supabase.rpc("apply_referral", {
    p_referee_user_id: refereeUserId,
    p_code: code.toUpperCase(),
    p_referee_email: email ?? null,
  });
  if (error) throw error;
  return data as { ok: boolean; reason?: string; referrer_user_id?: string };
}

// ============================================================
// The reward pipeline — call from /api/webhooks/stripe on
// invoice.payment_succeeded, passing the CUSTOMER's supabase
// user_id (found via subscriptions table or customer metadata).
//
// 1. Flip the referral row to qualified
// 2. If referrer just hit 2 qualified → attach coupon to their
//    active Stripe subscription
// 3. Mark stripe_coupon_applied_at so we never double-apply
// ============================================================
export async function qualifyAndReward(
  refereeUserId: string,
  stripeInvoiceId?: string
): Promise<{ applied: boolean; referrerUserId?: string }> {
  const supabase = adminClient();
  const { data, error } = await supabase.rpc("qualify_referral", {
    p_referee_user_id: refereeUserId,
    p_stripe_invoice_id: stripeInvoiceId ?? null,
  });
  if (error) {
    console.error("[referrals] qualify_referral failed", error);
    return { applied: false };
  }
  const result = data as {
    ok: boolean;
    reason?: string;
    referrer_user_id?: string;
    qualified_count?: number;
    just_unlocked?: boolean;
    already_applied?: boolean;
  };

  if (!result?.ok || !result.just_unlocked || result.already_applied) {
    return { applied: false, referrerUserId: result?.referrer_user_id };
  }

  const referrerUserId = result.referrer_user_id!;

  // Look up the referrer's active Stripe subscription via the
  // schema-scoped RPC. Some schemas (duowealth) resolve via
  // couple_members; others (scanzen/calmkids/memori) resolve by
  // user_id directly. The RPC hides that difference.
  const { data: subRows } = await supabase.rpc("resolve_active_subscription", {
    p_user_id: referrerUserId,
  });
  const sub = Array.isArray(subRows) ? subRows[0] : subRows;

  if (!sub?.stripe_subscription_id || !sub.stripe_customer_id) {
    console.warn(
      "[referrals] referrer has no active subscription yet — coupon will be applied on their next checkout",
      { referrerUserId }
    );
    return { applied: false, referrerUserId };
  }

  try {
    const stripe = stripeClient();
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      coupon: COUPON_ID,
    });
    await supabase.rpc("mark_referral_coupon_applied", {
      p_user_id: referrerUserId,
      p_customer_id: sub.stripe_customer_id,
      p_subscription_id: sub.stripe_subscription_id,
    });
    return { applied: true, referrerUserId };
  } catch (err) {
    console.error("[referrals] failed to attach coupon", err);
    return { applied: false, referrerUserId };
  }
}
