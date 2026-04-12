import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tellerFetch } from '@/lib/teller';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = request.nextUrl.searchParams.get('account_id');
  const count = request.nextUrl.searchParams.get('count') || '50';

  const { data: connections } = await supabase
    .from('bank_connections')
    .select('access_token')
    .eq('user_id', user.id);

  if (!connections?.length) {
    return NextResponse.json({ transactions: [] });
  }

  const allTransactions = [];

  for (const conn of connections) {
    try {
      if (accountId) {
        const res = await tellerFetch(
          `/accounts/${accountId}/transactions?count=${count}`,
          conn.access_token
        );
        if (res.ok) {
          const txns = await res.json();
          allTransactions.push(...txns);
        }
      } else {
        const acctRes = await tellerFetch('/accounts', conn.access_token);
        if (!acctRes.ok) continue;

        const accounts = await acctRes.json();
        for (const acct of accounts) {
          const res = await tellerFetch(
            `/accounts/${acct.id}/transactions?count=${count}`,
            conn.access_token
          );
          if (res.ok) {
            const txns = await res.json();
            allTransactions.push(...txns);
          }
        }
      }
    } catch {
      // Skip failed connections
    }
  }

  // Sort by date descending
  allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ transactions: allTransactions });
}
