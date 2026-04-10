'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Receipt,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

// Mock data — replace with Supabase queries once schema is live
const MOCK_NET_WORTH = 47250;
const MOCK_MONTHLY_BUDGET = 5200;
const MOCK_MONTHLY_SPENT = 3840;

const mockGoals = [
  { name: 'House Down Payment', target: 50000, current: 18500, color: '#0D9488', icon: '🏡' },
  { name: 'Emergency Fund', target: 15000, current: 9200, color: '#6366f1', icon: '🛡️' },
  { name: 'Vacation — Maui', target: 4500, current: 2100, color: '#f59e0b', icon: '✈️' },
];

const mockBills = [
  { name: 'Rent', amount: 2100, dueDay: 1, split: '50/50' },
  { name: 'Electric', amount: 120, dueDay: 15, split: '50/50' },
  { name: 'Netflix', amount: 22, dueDay: 22, split: '50/50' },
  { name: 'Car Insurance', amount: 185, dueDay: 5, split: '60/40' },
];

const mockTransactions = [
  { id: '1', description: 'Whole Foods', amount: -84.52, date: '2026-04-08', tag: 'Joint', category: 'Groceries' },
  { id: '2', description: 'Chase Sapphire — payment', amount: 450, date: '2026-04-07', tag: 'Joint', category: 'Payment' },
  { id: '3', description: 'Starbucks', amount: -6.75, date: '2026-04-07', tag: 'Partner 1', category: 'Dining' },
  { id: '4', description: 'Amazon', amount: -34.99, date: '2026-04-06', tag: 'Partner 2', category: 'Shopping' },
  { id: '5', description: 'Shell Gas', amount: -62.10, date: '2026-04-05', tag: 'Joint', category: 'Auto' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function ProgressBar({ percent, color = '#0D9488' }: { percent: number; color?: string }) {
  return (
    <div className="w-full bg-[#2a2a3d] rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function DashboardContent() {
  const budgetPercent = (MOCK_MONTHLY_SPENT / MOCK_MONTHLY_BUDGET) * 100;
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#e8e8f0]">
            Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-[#0D9488]">you two</span>
          </h2>
          <p className="text-sm text-[#8888a0] mt-0.5">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D9488]/15 rounded-full text-[#0D9488] text-sm font-medium">
          <Heart size={14} />
          <span>Day 47 together</span>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Net Worth */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#8888a0]">Combined Net Worth</span>
            <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 flex items-center justify-center">
              <DollarSign size={16} className="text-[#0D9488]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#e8e8f0]">{formatCurrency(MOCK_NET_WORTH)}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
            <TrendingUp size={12} />
            <span>+$1,240 this month</span>
          </div>
        </div>

        {/* Monthly Budget */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#8888a0]">April Budget</span>
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-[#6366f1]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#e8e8f0]">{formatCurrency(MOCK_MONTHLY_SPENT)}</div>
          <div className="mt-2">
            <ProgressBar
              percent={budgetPercent}
              color={budgetPercent > 90 ? '#ef4444' : budgetPercent > 75 ? '#f59e0b' : '#0D9488'}
            />
            <p className="text-xs text-[#8888a0] mt-1">
              {formatCurrency(MOCK_MONTHLY_BUDGET - MOCK_MONTHLY_SPENT)} remaining of {formatCurrency(MOCK_MONTHLY_BUDGET)}
            </p>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#8888a0]">Goals Progress</span>
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center">
              <Target size={16} className="text-[#f59e0b]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#e8e8f0]">{formatCurrency(mockGoals.reduce((s, g) => s + g.current, 0))}</div>
          <p className="text-xs text-[#8888a0] mt-1">
            saved across {mockGoals.length} goals
          </p>
        </div>
      </div>

      {/* Goals + Bills row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shared Goals */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#e8e8f0]">Shared Goals</h3>
            <Link href="/dashboard/goals" className="text-xs text-[#0D9488] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {mockGoals.map((goal) => {
              const pct = (goal.current / goal.target) * 100;
              return (
                <div key={goal.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{goal.icon}</span>
                      <span className="text-sm font-medium text-[#e8e8f0]">{goal.name}</span>
                    </div>
                    <span className="text-sm text-[#8888a0]">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <ProgressBar percent={pct} color={goal.color} />
                  <p className="text-xs text-[#8888a0] mt-0.5 text-right">{pct.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#e8e8f0]">Upcoming Bills</h3>
            <Link href="/dashboard/bills" className="text-xs text-[#0D9488] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockBills.map((bill) => (
              <div
                key={bill.name}
                className="flex items-center justify-between py-2 border-b border-[#2a2a3d]/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a26] flex items-center justify-center">
                    <Receipt size={14} className="text-[#8888a0]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#e8e8f0]">{bill.name}</div>
                    <div className="text-xs text-[#8888a0]">Due {bill.dueDay === 1 ? '1st' : `${bill.dueDay}th`} · Split {bill.split}</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#e8e8f0]">{formatCurrency(bill.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#e8e8f0]">Recent Transactions</h3>
          <Link href="/dashboard/transactions" className="text-xs text-[#0D9488] hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {mockTransactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#1a1a26] transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  txn.amount > 0 ? 'bg-green-500/15 text-green-400' : 'bg-[#2a2a3d] text-[#8888a0]'
                }`}>
                  {txn.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#e8e8f0]">{txn.description}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#8888a0]">{txn.date}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      txn.tag === 'Joint'
                        ? 'bg-[#0D9488]/15 text-[#0D9488]'
                        : txn.tag === 'Partner 1'
                        ? 'bg-[#6366f1]/15 text-[#6366f1]'
                        : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                    }`}>
                      {txn.tag}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-semibold ${txn.amount > 0 ? 'text-green-400' : 'text-[#e8e8f0]'}`}>
                {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
