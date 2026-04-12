import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { sendEmail } from '@/lib/email';

const BUG_REPORT_EMAIL = 'cory@salisburybookkeeping.com';

const SYSTEM_PROMPT = `You are DuoWealth's friendly AI assistant. DuoWealth is a budgeting app built specifically for couples who want to manage money together.

Your role:
- Help users understand how to use DuoWealth features (budgets, goals, bills, transactions, bank connections, partner invites, income split ratios)
- Answer questions about the app and how it works
- Help with setup and configuration
- Collect bug reports when users have issues

Key features you can help with:
- **Dashboard**: Overview of finances, net worth, spending trends
- **Budget**: Create and manage monthly budgets by category
- **Goals**: Set savings goals together (vacation, emergency fund, etc.)
- **Bills**: Track recurring bills and get reminders 3 days before due dates
- **Transactions**: View all transactions synced from connected bank accounts
- **Bank Connections**: Connect bank accounts via Teller for automatic transaction syncing (Settings page)
- **Partner Invite**: Invite your partner to share the account — both get full access on one subscription (Settings page)
- **Income Split Ratio**: Set how bills are split proportionally based on each partner's income (Settings page)
- **Subscription**: $5.99/month or $49.99/year with 14-day free trial

When a user wants to report a bug:
1. Ask them to describe the issue clearly
2. Ask what page they were on
3. Once you have enough info, tell them you'll submit the report and include [BUG_REPORT] in your response followed by a JSON block like: [BUG_REPORT]{"subject":"brief subject","description":"full description","page":"page name"}

Keep responses concise and friendly. Use short paragraphs. You're chatting, not writing documentation.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await request.json();

  if (!messages?.length) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Check if the AI wants to submit a bug report
    if (text.includes('[BUG_REPORT]')) {
      const jsonMatch = text.match(/\[BUG_REPORT\]\s*(\{[\s\S]*?\})/);
      if (jsonMatch) {
        try {
          const bugData = JSON.parse(jsonMatch[1]);
          const userEmail = user.email || 'unknown';
          const userName = user.user_metadata?.full_name || userEmail;

          await sendEmail({
            to: BUG_REPORT_EMAIL,
            subject: `[DuoWealth Bug] ${bugData.subject || 'Bug Report via Chat'}`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#12121a;border:1px solid #ef4444;border-radius:16px;padding:32px;">
      <h1 style="color:#e8e8f0;font-size:22px;margin:0 0 16px;">Bug Report (via AI Chat)</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="color:#8888a0;padding:6px 12px 6px 0;font-size:14px;">From:</td><td style="color:#e8e8f0;padding:6px 0;font-size:14px;">${userName} (${userEmail})</td></tr>
        <tr><td style="color:#8888a0;padding:6px 12px 6px 0;font-size:14px;">Page:</td><td style="color:#e8e8f0;padding:6px 0;font-size:14px;">${bugData.page || 'Not specified'}</td></tr>
      </table>
      <div style="background:#0a0a0f;border:1px solid #2a2a3d;border-radius:8px;padding:16px;">
        <p style="color:#e8e8f0;line-height:1.6;margin:0;font-size:14px;white-space:pre-wrap;">${bugData.description}</p>
      </div>
    </div>
  </div>
</body>
</html>`,
          });
        } catch {
          // JSON parse failed, skip bug report
        }
      }
      // Clean the [BUG_REPORT] marker from the displayed message
      const cleanText = text.replace(/\[BUG_REPORT\]\s*\{[\s\S]*?\}/, '').trim();
      return NextResponse.json({ message: cleanText });
    }

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error('[chat] Error:', error);
    return NextResponse.json({ error: 'Chat unavailable' }, { status: 500 });
  }
}
