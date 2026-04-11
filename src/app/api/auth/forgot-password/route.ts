/**
 * Server-side Forgot Password Endpoint
 * POST /api/auth/forgot-password
 *
 * Generates a Supabase password recovery link via the admin API and sends
 * a branded email through Resend. This bypasses Supabase's built-in SMTP
 * so the email comes from DuoWealth (not "Supabase") and the recovery
 * link uses our explicit redirectTo (not the Supabase Site URL, which
 * may still point at a different project).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const redirectTo = `${appUrl}/auth/callback?next=/reset-password`;

    const { data, error } = await (supabase.auth as any).admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    // Don't reveal whether the email exists — always return success.
    if (error) {
      console.error('[forgot-password] generateLink error:', error.message);
      return NextResponse.json({ success: true });
    }

    const actionLink: string | undefined = data?.properties?.action_link;
    if (actionLink) {
      try {
        await sendPasswordResetEmail(email, actionLink);
      } catch (sendErr: any) {
        console.error('[forgot-password] resend send error:', sendErr?.message || sendErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[forgot-password] unexpected error:', err?.message || err);
    // Still return success to avoid email-existence enumeration.
    return NextResponse.json({ success: true });
  }
}
