import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

const BUG_REPORT_EMAIL = 'cory@salisburybookkeeping.com';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subject, description, page } = await request.json();

  if (!description?.trim()) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  }

  const userEmail = user.email || 'unknown';
  const userName = user.user_metadata?.full_name || userEmail;

  await sendEmail({
    to: BUG_REPORT_EMAIL,
    subject: `[DuoWealth Bug] ${subject || 'Bug Report'}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#12121a;border:1px solid #ef4444;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:22px;margin:0 0 16px;">Bug Report</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="color:#8888a0;padding:6px 12px 6px 0;font-size:14px;white-space:nowrap;">From:</td><td style="color:#e8e8f0;padding:6px 0;font-size:14px;">${userName} (${userEmail})</td></tr>
        <tr><td style="color:#8888a0;padding:6px 12px 6px 0;font-size:14px;white-space:nowrap;">Page:</td><td style="color:#e8e8f0;padding:6px 0;font-size:14px;">${page || 'Not specified'}</td></tr>
        <tr><td style="color:#8888a0;padding:6px 12px 6px 0;font-size:14px;white-space:nowrap;">Subject:</td><td style="color:#e8e8f0;padding:6px 0;font-size:14px;">${subject || 'No subject'}</td></tr>
      </table>
      <div style="background:#0a0a0f;border:1px solid #2a2a3d;border-radius:8px;padding:16px;">
        <p style="color:#e8e8f0;line-height:1.6;margin:0;font-size:14px;white-space:pre-wrap;">${description}</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  });

  return NextResponse.json({ success: true });
}
