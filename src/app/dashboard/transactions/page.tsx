'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

type Tag = 'All' | 'Joint' | 'Partner 1' | 'Partner 2';

const mockTransactions = [
  { id: '1', description: 'Whole Foods Market', amount: -84.52, date: '2026-04-08', tag: 'Joint', category: 'Groceries' },
  { id: '2', description: 'Chase Sapphire — Payment', amount: 450.00, date: '2026-04-07', tag: 'Joint', category: 'Payment' },
  { id: '3', description: 'Starbucks', amount: -6.75, date: '2026-04-07', tag: 'Partner 1', category: 'Dining' },
  { id: '4', description: 'Amazon.com', amount: -34.99, date: '2026-04-06', tag: 'Partner 2', category: 'Shopping' },
  { id: '5', description: 'Shell Gas Station', amount: -62.10, date: '2026-04-05', tag: 'Joint', category: 'Auto' },
  { id: '6', description: 'Paycheck — Direct Deposit', amount: 3250.00, date: '2026-04-04', tag: 'Partner 1', category: 'Income' },
  { id: '7', description: 'Paycheck — Direct Deposit', amount: 2900.00, date: '2026-04-04', tag: 'Partner 2', category: 'Income' },
  { id: '8', description: 'Chipotle', amount: -28.40, date: '2026-04-03', tag: 'Joint', category: 'Dining' },
  { id: '9', description: 'Netflix', amount: -22.00, date: '2026-04-02', tag: 'Joint', category: 'Subscriptions' },
  { id: '10', description: 'Trader Joe\'s', amount: -67.23, date: '2026-04-01', tag: 'Joint', category: 'Groceries' },
  { id: '11', description: 'Rent — April', amount: -2100.00, date: '2026-04-01', tag: 'Joint', category: 'Housing' },
  { id: '12', description: 'Gym — Planet Fitness', amount: -40.00, date: '2026-04-01', tag: 'Partner 1', category: 'Health' },
];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n));
}

const TAG_COLORS: Record<string, string> = {
  'Joint': 'bg-[#0D9488]/15 text-[#0D9488]',
  'Partner 1': 'bg-[#6366f1]/15 text-[#6366f1]',
  'Partner 2': 'bg-[#f59e0b]/15 text-[#f59e0b]',
};

export default function TransactionsPage() {
  const [activeTag, setActiveTag] = useState<Tag>('All');
  const [search, setSearch] = useState('');

  const filtered = mockTransactions.filter((t) => {
    const tagMatch = activeTag === 'All' || t.tag === activeTag;
    const searchMatch = !search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return tagMatch && searchMatch;
  });

  const tags: Tag[] = ['All', 'Joint', 'Partner 1', 'Partner 2'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#e8e8f0]">Transactions</h2>
        <p className="text-sm text-[#8888a0] mt-0.5">April 2026 — {mockTransactions.length} transactions</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888a0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-[#12121a] border border-[#2a2a3d] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:border-[#0D9488] focus:outline-none transition"
          />
        </div>
        <div className="flex bg-[#12121a] border border-[#2a2a3d] rounded-lg p-1 gap-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTag === tag ? 'bg-[#0D9488] text-white' : 'text-[#8888a0] hover:text-[#e8e8f0]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[#8888a0]">
            <p>No transactions match your filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#2a2a3d]">
            {filtered.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-[#1a1a26] transition">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txn.amount > 0 ? 'bg-green-500/15' : 'bg-[#2a2a3d]'
                    }`}
                  >
                    {txn.amount > 0 ? (
                      <ArrowUpRight size={16} className="text-green-400" />
                    ) : (
                      <ArrowDownRight size={16} className="text-[#8888a0]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e8e8f0]">{txn.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#8888a0]">{txn.date}</span>
                      <span className="text-xs text-[#8888a0]">·</span>
                      <span className="text-xs text-[#8888a0]">{txn.category}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${TAG_COLORS[txn.tag] || ''}`}
                      >
                        {txn.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    txn.amount > 0 ? 'text-green-400' : 'text-[#e8e8f0]'
                  }`}
                >
                  {txn.amount > 0 ? '+' : '-'}{fmt(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
