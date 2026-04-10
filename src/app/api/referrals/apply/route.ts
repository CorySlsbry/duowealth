import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { applyReferralOnSignup } from "@/lib/referrals";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    // Resolve the calling user from their access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user) {
      return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
    }

    const bodyCode = (await req.json().catch(() => ({}))).code as string | undefined;
    const cookieCode = req.cookies.get("ref_code")?.value;
    const code = (bodyCode || cookieCode || "").toUpperCase();
    if (!code) return NextResponse.json({ ok: false, error: "no referral code" }, { status: 400 });

    const result = await applyReferralOnSignup(
      userRes.user.id,
      code,
      userRes.user.email ?? undefined
    );

    const res = NextResponse.json(result);
    // Clear cookie on success
    if (result.ok) res.cookies.delete("ref_code");
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
