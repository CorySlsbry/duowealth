'use client';

import { useState } from 'react';
import { Check, Plus, Receipt } from 'lucide-react';

type SplitType = 'equal' | 'proportional';

const mockBills = [
  { id: '1', name: 'Rent', amount: 2100, dueDay: 1, category: 'Housing', partner1Pct: 50, partner2Pct: 50, paid: true },
  { id: '2', name: 'Electric', amount: 118, dueDay: 15, category: 'Utilities', partner1Pct: 50, partner2Pct: 50, paid: false },
  { id: '3', name: 'Internet', amount: 65, dueDay: 10, category: 'Utilities', partner1Pct: 50, partner2Pct: 50, paid: false },
  { id: '4', name: 'Car Insurance', amount: 185, dueDay: 5, category: 'Auto', partner1Pct: 60, partner2Pct: 40, paid: true },
  { id: '5', name: 'Netflix', amount: 22, dueDay: 22, category: 'Subscriptions', partner1Pct: 50, partner2Pct: 50, paid: false },
  { id: '6', name: 'Spotify Duo', amount: 16, dueDay: 18, category: 'Subscriptions', partner1Pct: 50, partner2Pct: 50, paid: false },
  { id: '7', name: 'Gym', amount: 80, dueDay: 1, category: 'Health', partner1Pct: 50, partner2Pct: 50, paid: true },
];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function BillsPage() {
  const [splitType, setSplitType] = useState<SplitType>('equal');

  const totalMonthly = mockBills.reduce((s, b) => s + b.amount, 0);
  const partner1Total = mockBills.reduce((s, b) => s + b.amount * (b.partner1Pct / 100), 0);
  const partner2Total = mockBills.reduce((s, b) => s + b.amount * (b.partner2Pct / 100), 0);
  const unpaid = mockBills.filter((b) => !b.paid);
  const upcomingTotal = unpaid.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#e8e8f0]">Recurring Bills</h2>
          <p className="text-sm text-[#8888a0] mt-0.5">{mockBills.length} bills · {fmt(totalMonthly)}/month total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0D9488] hover:bg-[#14B8A6] text-white rounded-lg text-sm font-medium transition min-h-[44px]">
          <Plus size={16} />
          Add Bill
        </button>
      </div>

      {/* Split mode toggle */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#e8e8f0]">Split Mode</span>
          <div className="flex bg-[#0a0a0f] rounded-lg p-1 gap-1">
            <button
              onClick={() => setSplitType('equal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                splitType === 'equal' ? 'bg-[#0D9488] text-white' : 'text-[#8888a0] hover:text-[#e8e8f0]'
              }`}
            >
              50/50 Equal
            </button>
            <button
              onClick={() => setSplitType('proportional')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                splitType === 'proportional' ? 'bg-[#0D9488] text-white' : 'text-[#8888a0] hover:text-[#e8e8f0]'
              }`}
            >
              Proportional
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-[#8888a0]">Total / Month</p>
            <p className="text-lg font-bold text-[#e8e8f0]">{fmt(totalMonthly)}</p>
          </div>
          <div>
            <p className="text-xs text-[#8888a0]">Partner 1 Owes</p>
            <p className="text-lg font-bold text-[#0D9488]">{fmt(partner1Total)}</p>
          </div>
          <div>
            <p className="text-xs text-[#8888a0]">Partner 2 Owes</p>
            <p className="text-lg font-bold text-[#6366f1]">{fmt(partner2Total)}</p>
          </div>
        </div>
      </div>

      {/* Upcoming unpaid */}
      {unpaid.length > 0 && (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4">
          <p className="text-sm font-semibold text-[#f59e0b] mb-1">
            {unpaid.length} bills coming up — {fmt(upcomingTotal)} total
          </p>
          <p className="text-xs text-[#8888a0]">
            {unpaid.map((b) => b.name).join(', ')}
          </p>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl overflow-hidden">
        <div className="divide-y divide-[#2a2a3d]">
          {mockBills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-4 hover:bg-[#1a1a26] transition">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    bill.paid ? 'bg-[#0D9488]/15' : 'bg-[#2a2a3d]'
                  }`}
                >
                  {bill.paid ? (
                    <Check size={16} className="text-[#0D9488]" />
                  ) : (
                    <Receipt size={16} className="text-[#8888a0]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e8e8f0]">{bill.name}</p>
                  <p className="text-xs text-[#8888a0]">
                    Due {bill.dueDay === 1 ? '1st' : `${bill.dueDay}th`} · {bill.category} ·{' '}
                    {bill.partner1Pct}/{bill.partner2Pct} split
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#e8e8f0]">{fmt(bill.amount)}</p>
                <p className="text-xs text-[#8888a0]">
                  {fmt(bill.amount * (bill.partner1Pct / 100))} / {fmt(bill.amount * (bill.partner2Pct / 100))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
