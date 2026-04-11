import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | DuoWealth',
  description: 'DuoWealth privacy policy — how we collect, use, and protect your couple\u2019s budget data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen">
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur border-b border-[#1e1e2e] z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="font-bold text-lg tracking-tight">
            <span className="text-[#0D9488]">Duo</span><span className="text-[#e8e8f0]">Wealth</span>
          </Link>
          <Link href="/" className="text-sm text-[#8888a0] hover:text-[#e8e8f0] transition">
            &larr; Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#8888a0] mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-[#b0b0c8] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">1. About DuoWealth</h2>
              <p>DuoWealth is a budgeting app built for couples. Two partners share a single budget, set joint goals, and see the same transactions in real time. This policy describes what information we collect, how we use it, and the choices you have.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">2. Information We Collect</h2>
              <p>When you create an account, we collect your name, email address, and (when you subscribe) payment information processed securely by Stripe. Inside the app, we store the budget data you and your partner enter: budget categories, transactions, account nicknames, bills, and savings goals. We do not ask for or store raw bank credentials. If you choose to link an institution in a future release, that connection will use a read-only aggregator such as Plaid; until then, account entries are manual.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">3. Shared-Household Model</h2>
              <p>DuoWealth is designed so that both members of a couple can see the same budget. When you invite a partner to your couple, they will be able to view every shared account, transaction, goal, and bill in your workspace by design. If you do not want your partner to see certain financial information, do not enter it into DuoWealth. We do not provide a way to hide data from your own partner inside the same couple.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">4. How We Use Your Information</h2>
              <p>We use your information to operate the DuoWealth service, send account-related emails (billing receipts, partner invitations, important service notices), provide support, and improve the product. We do not sell your personal information to third parties and we do not use your budget data to train third-party AI models.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">5. Data Security</h2>
              <p>All data is encrypted in transit using TLS and at rest using the encryption provided by our infrastructure vendors. Our database is hosted on Supabase with row-level security policies that keep each couple\u2019s data isolated from every other couple. Payment processing is handled by Stripe, which is PCI DSS Level 1 compliant.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">6. Third-Party Services</h2>
              <p>We rely on the following providers: Stripe (payments and the customer billing portal), Supabase (database, authentication, storage), Vercel (application hosting), and Resend (transactional email). Each of these services has its own privacy policy governing its handling of data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">7. Data Retention and Deletion</h2>
              <p>We retain your couple\u2019s data for as long as the subscription is active. If you cancel, your data is retained for 30 days to allow reactivation, after which it is permanently deleted. You may request immediate deletion at any time by emailing us. Deleting a couple removes the data for both partners.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">8. Your Rights</h2>
              <p>You have the right to access, correct, export, or delete your personal data. To exercise any of these rights, contact us at <a href="mailto:cory@salisburybookkeeping.com" className="text-[#0D9488] hover:text-[#14b8a6] transition">cory@salisburybookkeeping.com</a>.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">9. Contact</h2>
              <p>If you have questions about this privacy policy, email us at <a href="mailto:cory@salisburybookkeeping.com" className="text-[#0D9488] hover:text-[#14b8a6] transition">cory@salisburybookkeeping.com</a>.</p>
            </section>

            <section>
              <p className="text-[#8888a0]">DuoWealth is a product of Salisbury Bookkeeping LLC.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
