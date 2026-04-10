import { NextRequest, NextResponse } from "next/server";
import { trackReferralClick } from "@/lib/referrals";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { code } = (await req.json()) as { code?: string };
    if (!code) return NextResponse.json({ ok: false, error: "missing code" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ua = req.headers.get("user-agent") ?? undefined;

    await trackReferralClick(code, ip, ua);

    const res = NextResponse.json({ ok: true });
    // 30-day cookie so signup flow can pick it up
    res.cookies.set("ref_code", code.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
