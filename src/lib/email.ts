/**
 * DuoWealth Email Service via Resend
 * Handles all transactional emails for couples
 */

import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || '');
  }
  return _resend;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'DuoWealth <hello@duowealth.app>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://duowealth.app';

// ── Email Templates ─────────────────────────────────────

function welcomeEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#0D9488;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:white;font-size:12px;">DW</div>
        <span style="font-size:20px;font-weight:bold;color:#e8e8f0;">Duo<span style="color:#0D9488">Wealth</span></span>
      </div>
    </div>
    <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:24px;margin:0 0 16px;">Welcome to DuoWealth, ${name}!</h1>
      <p style="color:#b0b0c8;line-height:1.6;margin:0 0 16px;">
        You're one step away from getting your couple on the same financial page. Here's how to get started:
      </p>
      <ol style="color:#b0b0c8;line-height:2;margin:0 0 24px;padding-left:20px;">
        <li>Invite your partner — they'll join your shared workspace</li>
        <li>Connect your bank accounts and credit cards</li>
        <li>Set your first joint savings goal</li>
      </ol>
      <a href="${APP_URL}/dashboard" style="display:block;background:#0D9488;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;">
        Set Up Your Budget
      </a>
    </div>
    <p style="color:#4a4a5d;text-align:center;font-size:12px;margin-top:24px;">
      DuoWealth · <a href="${APP_URL}/unsubscribe" style="color:#4a4a5d;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

function partnerInviteEmailHtml(inviterName: string, coupleName: string, inviteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#0D9488;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:white;font-size:12px;">DW</div>
        <span style="font-size:20px;font-weight:bold;color:#e8e8f0;">Duo<span style="color:#0D9488">Wealth</span></span>
      </div>
    </div>
    <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:24px;margin:0 0 16px;">${inviterName} invited you to DuoWealth</h1>
      <p style="color:#b0b0c8;line-height:1.6;margin:0 0 16px;">
        You've been invited to join <strong style="color:#e8e8f0;">${coupleName}</strong>'s shared budget on DuoWealth — the app built for couples to manage money together.
      </p>
      <p style="color:#b0b0c8;line-height:1.6;margin:0 0 24px;">
        Once you join, you'll both see the same accounts, goals, and transactions in real time.
      </p>
      <a href="${inviteUrl}" style="display:block;background:#0D9488;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;">
        Accept Invitation
      </a>
      <p style="color:#4a4a5d;font-size:12px;text-align:center;margin-top:16px;">
        This link expires in 7 days.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function trialEndingSoonEmailHtml(name: string, daysLeft: number): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#12121a;border:1px solid #2a2a3d;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:22px;margin:0 0 16px;">Your trial ends in ${daysLeft} days, ${name}</h1>
      <p style="color:#b0b0c8;line-height:1.6;margin:0 0 16px;">
        Your 14-day free trial ends soon. To keep your couple's budget running smoothly, subscribe for just $5.99/month.
      </p>
      <a href="${APP_URL}/pricing" style="display:block;background:#0D9488;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
        Continue for $5.99/month
      </a>
      <p style="color:#4a4a5d;font-size:12px;margin-top:16px;">30-day money-back guarantee after your first payment.</p>
    </div>
  </div>
</body>
</html>`;
}

function paymentFailedEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#12121a;border:1px solid #ef4444;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:22px;margin:0 0 16px;">We couldn't process your payment, ${name}</h1>
      <p style="color:#b0b0c8;line-height:1.6;margin:0 0 16px;">
        Your DuoWealth subscription payment failed. Please update your payment method to keep access for both partners.
      </p>
      <a href="${APP_URL}/api/portal" style="display:block;background:#ef4444;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
        Update Payment Method
      </a>
    </div>
  </div>
</body>
</html>`;
}

// ── Email Sending Functions ─────────────────────────────

export async function sendWelcomeEmail(email: string, name: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to DuoWealth, ${name}! Here's how to invite your partner`,
    html: welcomeEmailHtml(name),
  });
}

export async function sendPartnerInviteEmail(
  toEmail: string,
  inviterName: string,
  coupleName: string,
  inviteCode: string
) {
  const inviteUrl = `${APP_URL}/partner-invite?code=${inviteCode}`;
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `${inviterName} invited you to manage money together on DuoWealth`,
    html: partnerInviteEmailHtml(inviterName, coupleName, inviteUrl),
  });
}

export async function sendTrialEndingSoonEmail(email: string, name: string, daysLeft: number) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your DuoWealth trial ends in ${daysLeft} days`,
    html: trialEndingSoonEmailHtml(name, daysLeft),
  });
}

export async function sendPaymentFailedEmail(email: string, name: string) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Action needed: Update your DuoWealth payment method`,
    html: paymentFailedEmailHtml(name),
  });
}
