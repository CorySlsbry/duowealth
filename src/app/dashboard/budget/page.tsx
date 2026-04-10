'use client';

import { TrendingDown } from 'lucide-react';

const mockCategories = [
  { name: 'Housing', allocated: 2100, spent: 2100, color: '#0D9488', icon: '🏠' },
  { name: 'Groceries', allocated: 600, spent: 412, color: '#6366f1', icon: '🛒' },
  { name: 'Dining Out', allocated: 300, spent: 284, color: '#f59e0b', icon: '🍽️' },
  { name: 'Transportation', allocated: 450, spent: 380, color: '#ec4899', icon: '🚗' },
  { name: 'Utilities', allocated: 250, spent: 215, color: '#14b8a6', icon: '⚡' },
  { name: 'Entertainment', allocated: 200, spent: 167, color: '#a78bfa', icon: '🎬' },
  { name: 'Health & Fitness', allocated: 150, spent: 89, color: '#22c55e', icon: '💪' },
  { name: 'Shopping', allocated: 300, spent: 193, color: '#fb923c', icon: '🛍️' },
  { name: 'Subscriptions', allocated: 80, spent: 76, color: '#60a5fa', icon: '📱' },
  { name: 'Savings Transfer', allocated: 500, spent: 500, color: '#0D9488', icon: '💰' },
];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function BudgetPage() {
  const totalAllocated = mockCategories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = mockCategories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#e8e8f0]">April 2026 Budget</h2>
        <p className="text-sm text-[#8888a0] mt-0.5">Joint budget for both partners</p>
      </div>

      {/* Summary Bar */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-[#8888a0]">Total Spent</p>
            <p className="text-2xl font-bold text-[#e8e8f0]">{fmt(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#8888a0]">Budget</p>
            <p className="text-2xl font-bold text-[#e8e8f0]">{fmt(totalAllocated)}</p>
          </div>
        </div>
        <div className="w-full bg-[#2a2a3d] rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%`,
              backgroundColor: totalSpent / totalAllocated > 0.9 ? '#ef4444' : '#0D9488',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#8888a0]">
          <span>{((totalSpent / totalAllocated) * 100).toFixed(0)}% used</span>
          <span className="text-[#0D9488] font-medium">{fmt(remaining)} remaining</span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockCategories.map((cat) => {
          const pct = (cat.spent / cat.allocated) * 100;
          const over = cat.spent > cat.allocated;
          return (
            <div key={cat.name} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium text-[#e8e8f0]">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#e8e8f0]">{fmt(cat.spent)}</span>
                  <span className="text-xs text-[#8888a0]"> / {fmt(cat.allocated)}</span>
                </div>
              </div>
              <div className="w-full bg-[#2a2a3d] rounded-full h-2 mb-1">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: over ? '#ef4444' : pct > 85 ? '#f59e0b' : cat.color,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={over ? 'text-red-400' : 'text-[#8888a0]'}>
                  {over ? `Over by ${fmt(cat.spent - cat.allocated)}` : `${pct.toFixed(0)}%`}
                </span>
                {!over && (
                  <span className="text-[#8888a0]">{fmt(cat.allocated - cat.spent)} left</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center">
        <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#2a2a3d] rounded-lg text-sm text-[#8888a0] hover:border-[#0D9488] hover:text-[#0D9488] transition">
          <TrendingDown size={16} />
          Add Category
        </button>
      </div>
    </div>
  );
}
