import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TELLER_API = 'https://api.teller.io';

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
      // If account_id specified, fetch only that account's transactions
      if (accountId) {
        const res = await fetch(
          `${TELLER_API}/accounts/${accountId}/transactions?count=${count}`,
          {
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${conn.access_token}:`).toString('base64'),
            },
          }
        );
        if (res.ok) {
          const txns = await res.json();
          allTransactions.push(...txns);
        }
      } else {
        // Fetch accounts first, then transactions for each
        const acctRes = await fetch(`${TELLER_API}/accounts`, {
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${conn.access_token}:`).toString('base64'),
          },
        });
        if (!acctRes.ok) continue;

        const accounts = await acctRes.json();
        for (const acct of accounts) {
          const res = await fetch(
            `${TELLER_API}/accounts/${acct.id}/transactions?count=${count}`,
            {
              headers: {
                Authorization: 'Basic ' + Buffer.from(`${conn.access_token}:`).toString('base64'),
              },
            }
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
