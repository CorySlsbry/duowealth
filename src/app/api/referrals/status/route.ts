import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getReferralState } from "@/lib/referrals";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: userRes } = await supabase.auth.getUser(token);
    if (!userRes?.user) {
      return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
    }

    const state = await getReferralState(userRes.user.id);
    return NextResponse.json({ ok: true, state });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
