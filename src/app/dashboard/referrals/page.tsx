import { ReferralCard } from "@/components/referral-card";

export const metadata = {
  title: "Refer friends — get 20% off",
};

export default function ReferralsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Refer friends</h1>
      <p className="mt-2 text-gray-600">
        Help your friends discover the app and lock in a permanent 20% off your own subscription.
      </p>
      <div className="mt-8">
        <ReferralCard />
      </div>
      <div className="mt-10 rounded-xl bg-gray-50 p-6 text-sm text-gray-700">
        <h2 className="text-base font-semibold text-gray-900">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Share your referral link — it&apos;s unique to your account.</li>
          <li>When a friend signs up and starts a paid plan, they count as 1 of 2.</li>
          <li>The moment your second friend starts paying, we attach a 20% discount to your subscription automatically — you never touch your billing settings.</li>
          <li>It&apos;s for life: as long as you keep your subscription active, the discount stays.</li>
        </ol>
      </div>
    </main>
  );
}
