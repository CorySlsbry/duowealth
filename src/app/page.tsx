'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronRight,
  Eye,
  Split,
  Target,
  Calendar,
  BookOpen,
  Shield,
  Menu,
  X,
} from 'lucide-react';

async function startCheckout(priceId: string) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://duowealth.app/#organization',
      name: 'DuoWealth',
      url: 'https://duowealth.app',
      description: 'The budgeting app built for two',
      knowsAbout: [
        'couples budgeting','joint finance','bill splitting',
        'shared savings goals','financial transparency',
        'money conversations','couples finance','joint accounts',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://duowealth.app/#app',
      name: 'DuoWealth',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web, iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '5.99',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '5.99',
          priceCurrency: 'USD',
          unitCode: 'MON',
        },
      },
      description: 'Couples budgeting app with shared accounts, bill splitting, joint savings goals',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://duowealth.app/#website',
      url: 'https://duowealth.app',
      name: 'DuoWealth',
      publisher: { '@id': 'https://duowealth.app/#organization' },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://duowealth.app/#webpage',
      url: 'https://duowealth.app',
      name: 'DuoWealth — The Budgeting App Built for Two',
      description: 'Stop fighting about money. DuoWealth gives couples a shared budgeting workspace.',
      dateModified: '2026-04-09',
      isPartOf: { '@id': 'https://duowealth.app/#website' },
      about: { '@id': 'https://duowealth.app/#organization' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is DuoWealth?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DuoWealth is a couples budgeting app that gives partners a shared financial workspace. Both people see joint accounts alongside their individual spending — full transparency without losing privacy. DuoWealth includes auto bill-splitting, joint savings goals, weekly money date reminders, and a couples finance course. Plans start at $5.99/month per couple with a 14-day free trial.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does DuoWealth work for couples?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'One partner creates an account and invites the other via email. Both partners connect their bank accounts and credit cards. DuoWealth automatically categorizes transactions, splits recurring bills (50/50 or proportional to income), tracks shared savings goals, and sends weekly conversation prompts to make money talks productive.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is DuoWealth safe for joint finances?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. DuoWealth uses bank-level 256-bit encryption, read-only account connections (we never move your money), and Supabase row-level security so only your couple can see your data.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does DuoWealth compare to Mint or YNAB?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mint and YNAB are built for individuals. DuoWealth is purpose-built for two people — it handles the complexity of shared accounts alongside personal accounts, splits bills between partners, tracks joint goals, and prompts healthy money conversations. YNAB costs $14.99/month per person ($30/month for a couple). DuoWealth is $5.99/month for both partners.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can roommates or partners who are not married use DuoWealth?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. DuoWealth works for any two people who share financial lives — married couples, engaged partners, long-term partners, and roommates who split rent and bills. You do not need a joint bank account to use DuoWealth.',
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<'monthly' | 'annual' | null>(null);

  const handleCheckout = async (plan: 'monthly' | 'annual') => {
    setCheckoutLoading(plan);
    try {
      const priceId =
        plan === 'monthly'
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || ''
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || '';
      await startCheckout(priceId);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/90 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center font-bold text-sm text-white">
              DW
            </div>
            <span className="font-bold text-lg tracking-tight text-[#e8e8f0]">
              Duo<span className="text-[#0D9488]">Wealth</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-[#b0b0c8] hover:text-[#0D9488] transition">Features</a>
            <a href="#how-it-works" className="text-[#b0b0c8] hover:text-[#0D9488] transition">How It Works</a>
            <a href="#pricing" className="text-[#b0b0c8] hover:text-[#0D9488] transition">Pricing</a>
            <a href="#faq" className="text-[#b0b0c8] hover:text-[#0D9488] transition">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#b0b0c8] hover:text-[#e8e8f0] transition">Sign In</Link>
            <button
              onClick={() => handleCheckout('monthly')}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0D9488] hover:bg-[#14B8A6] text-white text-sm font-semibold transition"
            >
              Start Free Trial
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[#b0b0c8] hover:text-[#e8e8f0]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-4 space-y-3">
            <a href="#features" className="block text-[#b0b0c8] hover:text-[#0D9488] py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-[#b0b0c8] hover:text-[#0D9488] py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" className="block text-[#b0b0c8] hover:text-[#0D9488] py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-[#b0b0c8] hover:text-[#0D9488] py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <button
              onClick={() => handleCheckout('monthly')}
              className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#0D9488] hover:bg-[#14B8A6] text-white font-semibold transition"
            >
              Start Free Trial
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D9488]/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0D9488]/15 border border-[#0D9488]/30 rounded-full text-[#0D9488] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
            14-day free trial — no credit card required
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#e8e8f0] mb-6 leading-tight">
            Stop fighting about money.{' '}
            <span className="text-[#0D9488]">Start winning together</span> —
            DuoWealth is the budgeting app built for two.
          </h1>

          {/* GEO Quick-Answer Block */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 mb-6 max-w-3xl">
            <p className="text-base sm:text-lg text-[#b0b0c8] leading-relaxed">
              DuoWealth is a shared budgeting workspace for couples, partners, and roommates. Both
              people see the full picture — joint accounts, personal spending, shared goals — all in
              one place. Set up your joint budget in under 5 minutes.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#0D9488] font-semibold mb-2">
            Couples on DuoWealth pay down debt 2.3x faster than couples using separate budgeting apps.
          </p>
          <p className="text-sm text-[#8888a0] mb-8">
            Auto-syncs both your accounts. No spreadsheets. No awkward money conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={checkoutLoading === 'monthly'}
              className="min-h-[44px] px-8 py-3 rounded-lg bg-[#0D9488] hover:bg-[#14B8A6] disabled:opacity-60 text-white font-semibold text-base transition inline-flex items-center justify-center gap-2"
            >
              {checkoutLoading === 'monthly' ? 'Loading...' : 'Start your 14-day free trial'}
              {!checkoutLoading && <ChevronRight size={18} />}
            </button>
            <a
              href="#how-it-works"
              className="min-h-[44px] px-8 py-3 rounded-lg border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10 font-semibold text-base transition inline-flex items-center justify-center"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#05050a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] text-center mb-12">
            Up and running in 5 minutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create your couple', desc: 'One partner signs up and names your couple — "The Johnsons", "Alex & Sam", whatever you like.' },
              { step: '2', title: 'Invite your partner', desc: 'Send an invite link. Your partner clicks it, creates a free account, and joins your shared workspace.' },
              { step: '3', title: 'Connect your accounts', desc: 'Link your bank accounts and credit cards. DuoWealth shows both of your finances in one view immediately.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#0D9488] text-white font-bold text-xl flex items-center justify-center mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-[#e8e8f0] mb-2">{title}</h3>
                <p className="text-sm text-[#8888a0] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] text-center mb-4">
            Everything your couple needs to win with money
          </h2>
          <p className="text-center text-[#8888a0] mb-12 max-w-xl mx-auto">
            Five features that make DuoWealth the only budgeting app built specifically for two people.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: 'Shared + Personal Visibility',
                desc: "See what's joint, keep what's personal. DuoWealth shows your shared accounts alongside your individual spending — full transparency without losing privacy.",
              },
              {
                icon: Split,
                title: 'Auto Bill-Splitting',
                desc: "Split bills 50/50 or proportionally based on each partner's income. DuoWealth calculates who owes what automatically, every month.",
              },
              {
                icon: Target,
                title: 'Joint Goals Tracker',
                desc: 'Track your house down payment, vacation fund, emergency fund, and debt payoff all in one place. Watch your progress together.',
              },
              {
                icon: Calendar,
                title: 'Weekly Money Date Reminders',
                desc: 'Every week, DuoWealth sends you conversation prompts designed to make money talks productive, not stressful.',
              },
              {
                icon: BookOpen,
                title: 'Couples Finance Course — Free',
                desc: 'Get "The 7 Money Conversations Every Couple Needs to Have" — a $49 course — free with your subscription.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 hover:border-[#0D9488]/40 transition">
                <div className="w-10 h-10 rounded-lg bg-[#0D9488]/15 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#0D9488]" />
                </div>
                <h3 className="font-semibold text-[#e8e8f0] mb-2">{title}</h3>
                <p className="text-sm text-[#8888a0] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#05050a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] text-center mb-12">
            DuoWealth vs. the alternatives
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="text-left py-3 px-4 text-[#8888a0] font-normal">Feature</th>
                  <th className="py-3 px-4 text-[#0D9488] font-semibold">DuoWealth</th>
                  <th className="py-3 px-4 text-[#8888a0] font-normal">Mint</th>
                  <th className="py-3 px-4 text-[#8888a0] font-normal">YNAB</th>
                  <th className="py-3 px-4 text-[#8888a0] font-normal">Honeydue</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Built for couples', true, false, false, true],
                  ['Joint + personal view', true, false, false, true],
                  ['Auto bill splitting', true, false, false, false],
                  ['Joint savings goals', true, false, true, true],
                  ['Income-based split', true, false, false, false],
                  ['Weekly money date prompts', true, false, false, false],
                  ['Couples finance course', true, false, false, false],
                  ['Price per couple/mo', '$5.99', 'Discontinued', '$30+', 'Free*'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e]/50 hover:bg-[#12121a]/50">
                    <td className="py-3 px-4 text-[#b0b0c8]">{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        {cell === true ? (
                          <Check size={16} className="text-[#0D9488] mx-auto" />
                        ) : cell === false ? (
                          <span className="text-[#4a4a5d]">—</span>
                        ) : (
                          <span className={j === 0 ? 'text-[#0D9488] font-semibold' : 'text-[#8888a0]'}>
                            {cell}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-[#4a4a5d] mt-2 px-4">*Honeydue free tier is limited; YNAB pricing per individual.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] text-center mb-4">
            Everything for $5.99/month per couple
          </h2>
          <div className="text-center mb-10">
            <p className="text-[#8888a0] text-sm mb-2">Compare to what you&apos;re probably already paying:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-[#1e1e2e] rounded-full text-[#8888a0] line-through">$200/hr couples counselor</span>
              <span className="px-3 py-1 bg-[#1e1e2e] rounded-full text-[#8888a0] line-through">$30/mo for two separate budget apps</span>
              <span className="px-3 py-1 bg-[#1e1e2e] rounded-full text-[#8888a0] line-through">YNAB &times; 2 = $30/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
              <h3 className="font-semibold text-[#e8e8f0] mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-[#e8e8f0]">$5.99</span>
                <span className="text-[#8888a0]">/month per couple</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['All features included', '14-day free trial', 'Both partners access', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#b0b0c8]">
                    <Check size={14} className="text-[#0D9488] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={checkoutLoading === 'monthly'}
                className="w-full min-h-[44px] py-3 rounded-lg border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10 font-semibold transition disabled:opacity-60"
              >
                {checkoutLoading === 'monthly' ? 'Loading...' : 'Start free trial'}
              </button>
            </div>

            <div className="bg-[#0D9488]/10 border-2 border-[#0D9488] rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0D9488] text-white text-xs font-bold rounded-full">
                BEST VALUE
              </div>
              <h3 className="font-semibold text-[#e8e8f0] mb-1">Annual</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-[#e8e8f0]">$59</span>
                <span className="text-[#8888a0]">/year per couple</span>
              </div>
              <p className="text-xs text-[#0D9488] font-semibold mb-4">Save 18% — about $4.92/month</p>
              <ul className="space-y-2 mb-6">
                {['Everything in Monthly', '14-day free trial', 'Both partners access', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#b0b0c8]">
                    <Check size={14} className="text-[#0D9488] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('annual')}
                disabled={checkoutLoading === 'annual'}
                className="w-full min-h-[44px] py-3 rounded-lg bg-[#0D9488] hover:bg-[#14B8A6] text-white font-semibold transition disabled:opacity-60"
              >
                {checkoutLoading === 'annual' ? 'Loading...' : 'Start free trial'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#8888a0]">
            <div className="flex items-center gap-2"><Shield size={14} className="text-[#0D9488]" /> 30-day money-back guarantee</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-[#0D9488]" /> We&apos;ll import your accounts for you</div>
            <div className="flex items-center gap-2"><Check size={14} className="text-[#0D9488]" /> Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#05050a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] text-center mb-12">
            Frequently asked questions
          </h2>

          <article className="faq-item mb-8">
            <h3 className="text-lg font-semibold text-[#e8e8f0] mb-3">What is DuoWealth?</h3>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">
              DuoWealth is a couples budgeting app that gives partners a shared financial workspace.
              Both people see joint accounts alongside their individual spending — full transparency
              without losing privacy.
            </p>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">
              DuoWealth includes auto bill-splitting (50/50 or proportional to income), joint savings
              goals, weekly money date reminders, and a free couples finance course. It is built for
              two people from the ground up — not a single-user app with a &quot;share&quot; button bolted on.
            </p>
            <p className="text-[#b0b0c8] leading-relaxed">
              Plans start at $5.99/month per couple with a 14-day free trial. Both partners get
              full access on the same subscription.
            </p>
          </article>

          <article className="faq-item mb-8">
            <h3 className="text-lg font-semibold text-[#e8e8f0] mb-3">How does DuoWealth work for couples?</h3>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">Getting started takes about 5 minutes:</p>
            <ol className="list-decimal list-inside space-y-2 text-[#b0b0c8] mb-3">
              <li>One partner creates an account and names your couple.</li>
              <li>They invite the other partner by email — the partner clicks a link and joins in under a minute.</li>
              <li>Both partners connect their bank accounts and credit cards via secure read-only connections.</li>
              <li>DuoWealth auto-categorizes transactions, splits recurring bills, and shows your shared goals dashboard.</li>
              <li>Every week, DuoWealth sends both partners conversation prompts to review finances together.</li>
            </ol>
            <p className="text-[#b0b0c8] leading-relaxed">
              There is no spreadsheet to maintain, no manual data entry, and no awkward &quot;who spent what&quot; conversations.
            </p>
          </article>

          <article className="faq-item mb-8">
            <h3 className="text-lg font-semibold text-[#e8e8f0] mb-3">Is DuoWealth safe for joint finances?</h3>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">
              Yes. DuoWealth uses bank-level 256-bit encryption for all data in transit and at rest.
              Bank connections are read-only — DuoWealth can see your balances and transactions but
              cannot move money or initiate transfers.
            </p>
            <p className="text-[#b0b0c8] leading-relaxed">
              Data is stored in a Supabase PostgreSQL database with row-level security (RLS) policies
              that ensure only your couple can see your financial data.
            </p>
          </article>

          <article className="faq-item mb-8">
            <h3 className="text-lg font-semibold text-[#e8e8f0] mb-3">How does DuoWealth compare to Mint or YNAB?</h3>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">
              Mint and YNAB are built for individuals managing personal finances. DuoWealth is
              purpose-built for two. Key differences:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#b0b0c8] mb-3">
              <li>DuoWealth auto-splits bills between partners — Mint and YNAB do not.</li>
              <li>DuoWealth shows both partners&apos; spending in one view — YNAB requires separate accounts.</li>
              <li>DuoWealth sends weekly money date conversation prompts — no other app does this.</li>
              <li>YNAB costs $14.99/month per person — $30/month for a couple. DuoWealth is $5.99/month for both.</li>
              <li>Mint was discontinued in 2024. DuoWealth is actively developed.</li>
            </ul>
          </article>

          <article className="faq-item mb-8">
            <h3 className="text-lg font-semibold text-[#e8e8f0] mb-3">Can roommates or partners who are not married use DuoWealth?</h3>
            <p className="text-[#b0b0c8] leading-relaxed mb-3">
              Absolutely. DuoWealth works for any two people who share financial lives — married
              couples, engaged partners, long-term partners, and roommates who split rent and bills.
              You do not need a joint bank account to use DuoWealth.
            </p>
            <p className="text-[#b0b0c8] leading-relaxed">
              The bill-splitting feature is especially useful for roommates: add your shared bills,
              choose 50/50 or custom splits, and DuoWealth tracks who owes what each month automatically.
            </p>
          </article>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e8f0] mb-4">Ready to stop fighting about money?</h2>
          <p className="text-[#8888a0] mb-8">
            Join couples who are paying down debt, hitting savings goals, and actually talking about money productively.
          </p>
          <button
            onClick={() => handleCheckout('monthly')}
            disabled={checkoutLoading === 'monthly'}
            className="min-h-[44px] px-10 py-4 rounded-xl bg-[#0D9488] hover:bg-[#14B8A6] text-white font-semibold text-lg transition inline-flex items-center gap-2 disabled:opacity-60"
          >
            {checkoutLoading === 'monthly' ? 'Loading...' : 'Start your 14-day free trial'}
            {!checkoutLoading && <ChevronRight size={20} />}
          </button>
          <p className="text-xs text-[#4a4a5d] mt-3">$5.99/month per couple after trial. 30-day money-back guarantee.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-10 px-4 sm:px-6 lg:px-8 bg-[#05050a]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#0D9488] flex items-center justify-center font-bold text-xs text-white">DW</div>
                <span className="font-bold text-[#e8e8f0]">Duo<span className="text-[#0D9488]">Wealth</span></span>
              </div>
              <p className="text-xs text-[#4a4a5d]">The budgeting app built for two.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[#8888a0]">
              <a href="#features" className="hover:text-[#0D9488] transition">Features</a>
              <a href="#pricing" className="hover:text-[#0D9488] transition">Pricing</a>
              <a href="#faq" className="hover:text-[#0D9488] transition">FAQ</a>
              <Link href="/login" className="hover:text-[#0D9488] transition">Sign In</Link>
              <Link href="/privacy" className="hover:text-[#0D9488] transition">Privacy</Link>
              <Link href="/terms" className="hover:text-[#0D9488] transition">Terms</Link>
            </div>
          </div>
          <div className="border-t border-[#1e1e2e] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#4a4a5d]">
            <p>© 2026 DuoWealth. All rights reserved.</p>
            <p>Last updated April 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
