'use client';

import { Plus, Calendar } from 'lucide-react';

const mockGoals = [
  {
    name: 'House Down Payment',
    target: 50000,
    current: 18500,
    targetDate: '2027-06-01',
    color: '#0D9488',
    icon: '🏡',
    partner1Contribution: 9500,
    partner2Contribution: 9000,
    notes: '20% down on $250K home in Austin',
  },
  {
    name: 'Emergency Fund',
    target: 15000,
    current: 9200,
    targetDate: '2026-12-01',
    color: '#6366f1',
    icon: '🛡️',
    partner1Contribution: 4800,
    partner2Contribution: 4400,
    notes: '6 months of joint expenses',
  },
  {
    name: 'Vacation — Maui',
    target: 4500,
    current: 2100,
    targetDate: '2026-09-15',
    color: '#f59e0b',
    icon: '✈️',
    partner1Contribution: 1050,
    partner2Contribution: 1050,
    notes: '10-day trip in September',
  },
  {
    name: 'Car Replacement Fund',
    target: 8000,
    current: 1200,
    targetDate: '2027-01-01',
    color: '#ec4899',
    icon: '🚙',
    partner1Contribution: 700,
    partner2Contribution: 500,
    notes: 'Replacing the 2018 Honda',
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function monthsUntil(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export default function GoalsPage() {
  const totalSaved = mockGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = mockGoals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#e8e8f0]">Shared Goals</h2>
          <p className="text-sm text-[#8888a0] mt-0.5">
            {fmt(totalSaved)} saved of {fmt(totalTarget)} total target
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0D9488] hover:bg-[#14B8A6] text-white rounded-lg text-sm font-medium transition min-h-[44px]">
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {mockGoals.map((goal) => {
          const pct = (goal.current / goal.target) * 100;
          const months = monthsUntil(goal.targetDate);
          const monthlyNeeded = months > 0 ? (goal.target - goal.current) / months : 0;

          return (
            <div key={goal.name} className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5 hover:border-[#0D9488]/40 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[#e8e8f0]">{goal.name}</h3>
                    <p className="text-xs text-[#8888a0]">{goal.notes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8888a0]">
                  <Calendar size={12} />
                  <span>{months}mo left</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-[#e8e8f0]">{fmt(goal.current)}</span>
                  <span className="text-[#8888a0]">of {fmt(goal.target)}</span>
                </div>
                <div className="w-full bg-[#2a2a3d] rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: goal.color }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: goal.color }}>{pct.toFixed(0)}% complete</span>
                  <span className="text-[#8888a0]">{fmt(goal.target - goal.current)} to go</span>
                </div>
              </div>

              {/* Contribution split */}
              <div className="bg-[#1a1a26] rounded-lg p-3 mb-3">
                <div className="flex justify-between text-xs text-[#8888a0] mb-1.5">
                  <span>Contribution split</span>
                  <span>50/50</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-[#8888a0]">Partner 1</p>
                    <p className="text-sm font-semibold text-[#e8e8f0]">{fmt(goal.partner1Contribution)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#8888a0]">Partner 2</p>
                    <p className="text-sm font-semibold text-[#e8e8f0]">{fmt(goal.partner2Contribution)}</p>
                  </div>
                </div>
              </div>

              {months > 0 && (
                <p className="text-xs text-[#8888a0]">
                  Need to save{' '}
                  <span className="font-semibold" style={{ color: goal.color }}>
                    {fmt(monthlyNeeded)}/month
                  </span>{' '}
                  to hit your target by {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
