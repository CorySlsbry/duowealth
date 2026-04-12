import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TELLER_API = 'https://api.teller.io';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connections } = await supabase
    .from('bank_connections')
    .select('access_token, institution_name')
    .eq('user_id', user.id);

  if (!connections?.length) {
    return NextResponse.json({ accounts: [] });
  }

  const allAccounts = [];

  for (const conn of connections) {
    try {
      const res = await fetch(`${TELLER_API}/accounts`, {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${conn.access_token}:`).toString('base64'),
        },
      });

      if (!res.ok) continue;

      const accounts = await res.json();
      for (const acct of accounts) {
        // Fetch balance for each account
        try {
          const balRes = await fetch(`${TELLER_API}/accounts/${acct.id}/balances`, {
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${conn.access_token}:`).toString('base64'),
            },
          });
          if (balRes.ok) {
            acct.balances = await balRes.json();
          }
        } catch {
          // Balance fetch failed, continue without it
        }
        allAccounts.push(acct);
      }
    } catch {
      // Connection might be stale, skip
    }
  }

  return NextResponse.json({ accounts: allAccounts });
}
