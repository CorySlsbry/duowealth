import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — DuoWealth',
  description: 'DuoWealth is the budgeting app built for two.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block font-bold text-xl mb-8">
            <span className="text-primary">Duo</span><span className="text-dark">Wealth</span>
          </Link>
          <h1 className="text-fluid-3xl font-bold text-dark mb-4">About DuoWealth</h1>
        </div>
        <div className="prose text-text-secondary leading-relaxed space-y-6">
          <p>
            DuoWealth was built because couples deserve a budgeting app that actually understands how two people manage money together. Not a personal finance app with a &ldquo;share with spouse&rdquo; bolt-on — a product designed from the ground up for two people.
          </p>
          <p>
            Money is one of the top reasons couples argue. Most of those arguments come from information asymmetry: one person knows the account balance, the other doesn&apos;t. One person knows a big bill is coming, the other doesn&apos;t. DuoWealth fixes that. Both partners see the same real-time picture.
          </p>
          <p>
            DuoWealth costs $5.99 per month per couple — covering both partners under one subscription. There are no feature tiers, no per-seat fees, and no paywalled features.
          </p>
        </div>
        <div className="mt-10 text-center">
          <Link href="/pricing" className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition min-h-tap">
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
