import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DuoWealth — The Budgeting App Built for Two',
    template: '%s | DuoWealth',
  },
  description:
    'DuoWealth helps couples see every dollar, goal, and bill together. Stop fighting about money — start winning together. $5.99/mo per couple, 14-day free trial.',
  keywords: [
    'couples budgeting app',
    'joint budgeting',
    'shared finances',
    'couples money app',
    'budget together',
    'shared expenses',
    'partner budgeting',
    'family budget app',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://duowealth.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'DuoWealth',
    title: 'DuoWealth — The Budgeting App Built for Two',
    description:
      'Stop fighting about money. Start winning together. Shared dashboard, joint goals, bill splitting, real-time sync between partners.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DuoWealth' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DuoWealth — The Budgeting App Built for Two',
    description:
      'Shared finances made simple. $5.99/mo per couple, 14-day free trial.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://duowealth.vercel.app';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: 'DuoWealth',
      url: APP_URL,
      logo: { '@type': 'ImageObject', url: `${APP_URL}/logo.png` },
      sameAs: ['https://github.com/CorySlsbry/duowealth'],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${APP_URL}/#app`,
      name: 'DuoWealth',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Android, iOS, Web',
      offers: [
        {
          '@type': 'Offer',
          name: 'Monthly',
          price: '5.99',
          priceCurrency: 'USD',
          billingIncrement: 'P1M',
          description: '14-day free trial, cancel anytime',
        },
        {
          '@type': 'Offer',
          name: 'Annual',
          price: '59.00',
          priceCurrency: 'USD',
          billingIncrement: 'P1Y',
          description: 'Save $11.88 vs monthly',
        },
      ],
      knowsAbout: [
        'couples budgeting',
        'joint financial planning',
        'shared expense tracking',
        'bill splitting for couples',
        'partner goal setting',
        'debt payoff planning',
        'emergency fund allocation',
        'couples financial goals',
      ],
      publisher: { '@id': `${APP_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      url: APP_URL,
      name: 'DuoWealth',
      publisher: { '@id': `${APP_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/#webpage`,
      url: APP_URL,
      name: 'DuoWealth — The Budgeting App Built for Two',
      isPartOf: { '@id': `${APP_URL}/#website` },
      about: { '@id': `${APP_URL}/#app` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is DuoWealth?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DuoWealth is a couples budgeting app that gives partners a shared financial dashboard. Both people see every transaction, bill, savings goal, and budget category in real time — no more mystery charges or misaligned spending. It costs $5.99 per month per couple.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does DuoWealth cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DuoWealth costs $5.99 per month per couple — that is one subscription price that covers both partners, not a per-person fee. An annual plan is available at $59 per year, saving $11.88 compared to monthly billing. All plans include a 14-day free trial with no credit card required to start, plus a 30-day money-back guarantee.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does DuoWealth sync between partners?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "When one partner logs a transaction, updates a budget, or marks a bill paid, the change appears instantly on the other partner's dashboard. DuoWealth uses real-time database sync so both people always see the same up-to-date numbers without manual refresh.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is DuoWealth secure?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DuoWealth uses row-level security in a Postgres database hosted on Supabase, meaning your financial data is isolated to your couple only — other users cannot access your records. Authentication uses industry-standard JWT tokens and HTTPS everywhere.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can we use DuoWealth for joint and separate accounts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. DuoWealth supports both joint accounts (shared visibility) and separate accounts (individual visibility). Partners can choose which accounts to share and which to keep private, giving each couple full control over their financial transparency.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens after the 14-day trial?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After the 14-day free trial, your subscription begins at $5.99 per month (or $59 per year). You will receive an email reminder before the trial ends. You can cancel anytime before the trial expires with no charge. If you are unsatisfied within 30 days of your first payment, DuoWealth offers a full refund.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does DuoWealth work on Android?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. DuoWealth is available as an Android app on the Google Play Store. It is built with Capacitor and loads the same web app as the desktop version, so all features are identical across platforms. iOS support is available via the web app at duowealth.vercel.app.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0D9488" />
      </head>
      <body>{children}</body>
    </html>
  );
}
