/**
 * POST /api/referrals/send-invites
 *
 * Body: { inviterEmail, friendEmails: string[] }
 * Response: { code, sent: number }
 *
 * Flow:
 *  1. Validate all emails (RFC-ish regex).
 *  2. Call Supabase RPC send_referral_invites(inviter_user_id?, inviter_email, friend_emails[])
 *     which creates referral_invites rows and returns the shared code.
 *  3. Send one email per friend via Resend with the discount link.
 *  4. Return the code so the caller can set a cookie / proceed to checkout.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, inviteFriendEmailHtml } from '@/lib/email';

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'our app';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length < 255 && EMAIL_RE.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inviterEmail = String(body?.inviterEmail || '').trim();
    const friendEmails = Array.isArray(body?.friendEmails)
      ? body.friendEmails.map((e: unknown) => String(e || '').trim()).filter(Boolean)
      : [];

    if (!isValidEmail(inviterEmail)) {
      return NextResponse.json({ error: 'invalid inviter email' }, { status: 400 });
    }
    if (friendEmails.length < 2) {
      return NextResponse.json({ error: 'need 2 friend emails' }, { status: 400 });
    }
    for (const e of friendEmails) {
      if (!isValidEmail(e)) {
        return NextResponse.json({ error: `invalid friend email: ${e}` }, { status: 400 });
      }
    }
    const unique = new Set(friendEmails.map((e: string) => e.toLowerCase()));
    if (unique.has(inviterEmail.toLowerCase())) {
      return NextResponse.json({ error: "can't refer yourself" }, { status: 400 });
    }
    if (unique.size !== friendEmails.length) {
      return NextResponse.json({ error: 'friend emails must be unique' }, { status: 400 });
    }

    // Try to resolve authenticated inviter user id (optional — guest flow OK)
    let inviterUserId: string | null = null;
    try {
      const { createClient: createServerClient } = await import('@/lib/supabase/server');
      const supabase = await (createServerClient as any)();
      const { data } = await supabase.auth.getUser();
      if (data?.user) inviterUserId = data.user.id;
    } catch {
      // guest flow
    }

    const supabase = createAdminClient();
    const { data: code, error: rpcError } = await (supabase as any).rpc('send_referral_invites', {
      p_inviter_user_id: inviterUserId,
      p_inviter_email: inviterEmail,
      p_friend_emails: friendEmails,
    });

    if (rpcError) {
      console.error('send_referral_invites RPC failed:', rpcError);
      return NextResponse.json({ error: 'failed to create invites' }, { status: 500 });
    }

    // Send friend invite emails (best-effort)
    const link = `${APP_URL}/?r=${encodeURIComponent(code)}`;
    const results = await Promise.allSettled(
      friendEmails.map((fe: string) =>
        sendEmail({
          to: fe,
          subject: `${inviterEmail} sent you 20% off ${APP_NAME}`,
          html: inviteFriendEmailHtml({ inviterEmail, appName: APP_NAME, link }),
        })
      )
    );
    const sent = results.filter((r) => r.status === 'fulfilled').length;

    return NextResponse.json({ code, sent });
  } catch (err: any) {
    console.error('send-invites error:', err?.message || err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
