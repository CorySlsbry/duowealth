'use client';

import { useState } from 'react';
import { Users, Bell, CreditCard, Shield, UserPlus, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [incomeRatio, setIncomeRatio] = useState(50);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyMoneyDate, setWeeklyMoneyDate] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const handleInvite = () => {
    if (partnerEmail.trim()) {
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 3000);
      setPartnerEmail('');
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-[#e8e8f0]">Settings</h2>
        <p className="text-sm text-[#8888a0] mt-0.5">Manage your couple&apos;s DuoWealth account</p>
      </div>

      {/* Partner Invite */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#0D9488]/15 flex items-center justify-center">
            <UserPlus size={18} className="text-[#0D9488]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">Invite Your Partner</h3>
            <p className="text-xs text-[#8888a0]">Both people get full access on one subscription</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="email"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            placeholder="partner@email.com"
            className="flex-1 bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:border-[#0D9488] focus:outline-none transition"
          />
          <button
            onClick={handleInvite}
            disabled={!partnerEmail.trim() || inviteSent}
            className="px-4 py-2.5 bg-[#0D9488] hover:bg-[#14B8A6] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition min-h-[44px]"
          >
            {inviteSent ? 'Sent!' : 'Send Invite'}
          </button>
        </div>
      </div>

      {/* Income Split */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#6366f1]/15 flex items-center justify-center">
            <Users size={18} className="text-[#6366f1]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">Income Split Ratio</h3>
            <p className="text-xs text-[#8888a0]">Used for proportional bill splitting</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#8888a0]">Partner 1</span>
            <span className="text-[#0D9488] font-semibold">{incomeRatio}%</span>
            <span className="text-[#8888a0]">Partner 2</span>
            <span className="text-[#6366f1] font-semibold">{100 - incomeRatio}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={incomeRatio}
            onChange={(e) => setIncomeRatio(Number(e.target.value))}
            className="w-full accent-[#0D9488]"
          />
          <div className="flex justify-between text-xs text-[#8888a0]">
            <span>10/90</span>
            <span>50/50 (equal)</span>
            <span>90/10</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center">
            <Bell size={18} className="text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">Notifications</h3>
            <p className="text-xs text-[#8888a0]">Manage when DuoWealth emails you</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', sublabel: 'Get notified about important account activity', value: emailNotifs, onChange: setEmailNotifs },
            { label: 'Weekly money date', sublabel: 'Conversation prompts every Sunday evening', value: weeklyMoneyDate, onChange: setWeeklyMoneyDate },
            { label: 'Payment alerts', sublabel: 'Bill reminders 3 days before due date', value: paymentAlerts, onChange: setPaymentAlerts },
          ].map(({ label, sublabel, value, onChange }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#e8e8f0]">{label}</p>
                <p className="text-xs text-[#8888a0]">{sublabel}</p>
              </div>
              <button
                onClick={() => onChange(!value)}
                className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-[#0D9488]' : 'bg-[#2a2a3d]'}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#22c55e]/15 flex items-center justify-center">
            <CreditCard size={18} className="text-[#22c55e]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">Subscription & Billing</h3>
            <p className="text-xs text-[#8888a0]">Manage your plan, payment method, and invoices</p>
          </div>
        </div>
        <button
          onClick={handleManageBilling}
          className="w-full py-2.5 border border-[#2a2a3d] hover:border-[#0D9488] text-[#e8e8f0] hover:text-[#0D9488] rounded-lg text-sm font-medium transition min-h-[44px]"
        >
          Manage Billing — Stripe Portal
        </button>
      </div>

      {/* Security */}
      <div className="bg-[#12121a] border border-[#2a2a3d] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#8888a0]/15 flex items-center justify-center">
            <Shield size={18} className="text-[#8888a0]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#e8e8f0]">Privacy & Security</h3>
            <p className="text-xs text-[#8888a0]">Your data is encrypted and private to your couple</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-[#8888a0]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            256-bit encryption in transit and at rest
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            Row-level security — only your couple can see your data
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            Read-only bank connections — we never move your money
          </div>
        </div>
      </div>
    </div>
  );
}
