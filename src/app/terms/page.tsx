import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | DuoWealth',
  description: 'DuoWealth terms of service — the agreement between you, your partner, and Salisbury Bookkeeping LLC.',
};

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-[#8888a0] mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-[#b0b0c8] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">1. Acceptance of Terms</h2>
              <p>By creating a DuoWealth account or joining a partner\u2019s couple, you agree to these Terms of Service. DuoWealth is operated by Salisbury Bookkeeping LLC. If you do not agree to these terms, do not use the service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">2. Accounts and Couple Invitations</h2>
              <p>You are responsible for maintaining the security of your account credentials and not sharing your login with anyone, including your partner. Each partner must create their own individual account and then join a couple via the partner-invite flow. A couple is limited to two members. We reserve the right to suspend accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">3. Subscription and Billing</h2>
              <p>DuoWealth is sold per couple, not per user. One active subscription covers both members of the couple. Plans and current pricing are shown on our pricing page. After any free trial, your selected plan will be billed to the payment method on file on a recurring basis (monthly or annually) until cancelled. You may upgrade, downgrade, or cancel at any time through the Stripe customer portal. Cancellations take effect at the end of the current billing period.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">4. Shared Data Model</h2>
              <p>DuoWealth is designed around a shared-household model. When you join or create a couple, every transaction, budget category, goal, bill, and account you add is visible to your partner. Do not enter information into DuoWealth that you are not willing for your partner to see. You are solely responsible for deciding what to enter and which partner to invite.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">5. Acceptable Use</h2>
              <p>You agree not to use DuoWealth to: violate any law; infringe any third party\u2019s rights; transmit malware or attempt to compromise the service; scrape or reverse-engineer the application; or use the service for any commercial bookkeeping on behalf of clients. DuoWealth is intended for personal and household budgeting only.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">6. No Financial Advice</h2>
              <p>DuoWealth is a budgeting tool. Any figures, summaries, or suggestions shown inside the app are informational only and do not constitute financial, investment, tax, or legal advice. Always consult a qualified professional before making significant financial decisions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">7. Service Availability</h2>
              <p>We work to keep DuoWealth reliable, but the service is provided \u201cas is\u201d and \u201cas available.\u201d We do not guarantee uninterrupted availability, freedom from errors, or that the service will meet your specific requirements.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, DuoWealth and Salisbury Bookkeeping LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data or loss of savings, arising out of or related to your use of the service. Our total liability for any claims related to the service is limited to the amount you have paid us in the 12 months preceding the claim.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">9. Governing Law</h2>
              <p>These terms are governed by the laws of the State of Delaware, without regard to its conflict-of-laws principles. Any disputes shall be resolved in the state or federal courts located in Delaware.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">10. Changes to Terms</h2>
              <p>We may update these terms from time to time. We will notify you of material changes via email or in-app notice. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#e8e8f0] mb-2">11. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:cory@salisburybookkeeping.com" className="text-[#0D9488] hover:text-[#14b8a6] transition">cory@salisburybookkeeping.com</a>.</p>
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
