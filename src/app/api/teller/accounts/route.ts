import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tellerFetch } from '@/lib/teller';

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
      const res = await tellerFetch('/accounts', conn.access_token);
      if (!res.ok) continue;

      const accounts = await res.json();
      for (const acct of accounts) {
        try {
          const balRes = await tellerFetch(`/accounts/${acct.id}/balances`, conn.access_token);
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
