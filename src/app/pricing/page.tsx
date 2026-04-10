import Link from 'next/link';
import { Check } from 'lucide-react';
import { CheckoutButton } from '@/components/checkout-button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — DuoWealth',
  description: '$5.99/mo per couple. 14-day free trial. No credit card required to start.',
};

const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_MONTHLY || '';
const ANNUAL_PRICE_ID = process.env.STRIPE_PRICE_ANNUAL || '';

const features = [
  'Shared couple dashboard',
  'Real-time partner sync',
  'Bill splitting',
  'Joint goals tracker',
  'Expense categorization',
  'Debt payoff tracker',
  'Date-night fund',
  'Emergency fund auto-allocation',
  'Private & joint account support',
  'Android app (Play Store)',
  'Email support',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block font-bold text-xl mb-8">
            <span className="text-primary">Duo</span><span className="text-dark">Wealth</span>
          </Link>
          <h1 className="text-fluid-3xl font-bold text-dark mb-4">Simple pricing for couples</h1>
          <p className="text-text-secondary text-fluid-base">One price. Both partners. Every feature.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          {/* Monthly */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="font-bold text-dark text-xl mb-1">Monthly</h2>
            <p className="text-text-secondary text-sm mb-6">Flexible, cancel anytime</p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-dark">$5.99</span>
              <span className="text-text-secondary">/mo</span>
            </div>
            <CheckoutButton
              priceId={MONTHLY_PRICE_ID}
              className="w-full py-3 px-6 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition min-h-tap"
            >
              Start Free Trial
            </CheckoutButton>
          </div>

          {/* Annual — anchored as best value */}
          <div className="bg-dark rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <h2 className="font-bold text-white text-xl mb-1">Annual</h2>
            <p className="text-slate-400 text-sm mb-6">Save $11.88 vs monthly</p>
            <div className="mb-1">
              <span className="text-5xl font-bold text-white">$59</span>
              <span className="text-slate-400">/yr</span>
            </div>
            <p className="text-primary-500 text-sm mb-6">= $4.92/mo — 2 months free</p>
            <CheckoutButton
              priceId={ANNUAL_PRICE_ID}
              className="w-full py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-700 transition min-h-tap"
            >
              Start Free Trial
            </CheckoutButton>
          </div>
        </div>

        {/* Feature list */}
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8">
          <h3 className="font-semibold text-dark mb-4 text-center">Everything included in both plans</h3>
          <ul className="space-y-3">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3 text-text-secondary">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-8 text-sm text-text-secondary">
          14-day free trial · No credit card required · 30-day money-back guarantee
        </div>
      </div>
    </div>
  );
}
