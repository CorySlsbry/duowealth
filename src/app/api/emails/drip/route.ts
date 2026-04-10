/**
 * DuoWealth Drip Email Endpoint
 * POST /api/emails/drip
 * Called by cron to send onboarding drip emails
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sendTrialEndingSoonEmail } from '@/lib/email';
import { createClient as createAdminClient } from '@supabase/supabase-js';

async function handleDrip(_request: NextRequest) {
  try {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find subscriptions with trials ending in ~3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: subs } = await admin
      .from('subscriptions')
      .select('stripe_customer_id, couple_id')
      .eq('status', 'trialing')
      .lte('trial_end', threeDaysFromNow.toISOString());

    if (subs && subs.length > 0) {
      for (const sub of subs) {
        // In a real implementation, look up user email from auth.users
        // For now, log only
        console.log('Trial ending soon for couple:', sub.couple_id);
      }
    }

    return NextResponse.json({ success: true, processed: subs?.length ?? 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleDrip(request);
}

export async function POST(request: NextRequest) {
  return handleDrip(request);
}
