/**
 * Supabase Auth Callback Endpoint
 * GET /auth/callback
 * Handles the email confirmation redirect from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';

// Only allow same-origin relative paths to prevent open-redirect attacks
function safeNext(raw: string | null): string {
  if (!raw) return '/dashboard';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/dashboard';
  return raw;
}

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = safeNext(searchParams.get('next'));

    // Validate that we have an auth code
    if (!code) {
      console.error('Missing auth code in callback');
      return NextResponse.redirect(`${appUrl}/login?error=missing_code`);
    }

    // Create a server client and exchange the code for a session
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${appUrl}/login?error=invalid_code`);
    }

    // Successfully authenticated — honor the `next` hint (e.g. /reset-password
    // for password-recovery flows triggered from welcome emails)
    return NextResponse.redirect(`${appUrl}${next}`);
  } catch (error) {
    console.error('Auth callback exception:', error);
    return NextResponse.redirect(`${appUrl}/login?error=callback_failed`);
  }
}
