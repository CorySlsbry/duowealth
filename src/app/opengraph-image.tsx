import { ImageResponse } from 'next/og';

// Next.js will serve this at /opengraph-image when a URL is rendered
// for social sharing (Twitter/X, LinkedIn, Facebook, Slack, Discord).
// This REPLACES the static public/og-image.png — we generate it per-app
// dynamically so each vertical gets its own branded share card.
export const runtime = 'edge';
export const alt = 'DuoWealth — The budgeting app built for two';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #10B981 0%, #065f46 50%, #022c22 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 80,
          position: 'relative',
        }}
      >
        {/* subtle background rings */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'flex',
          }}
        >
          DuoWealth
        </div>
        <div
          style={{
            fontSize: 108,
            color: 'white',
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Built for two.
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255,255,255,0.9)',
            marginTop: 32,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.35,
            display: 'flex',
          }}
        >
          The budgeting app for couples who share a life — and a checking account.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 80,
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
          }}
        >
          duowealth.vercel.app
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 80,
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
          }}
        >
          14-day free trial
        </div>
      </div>
    ),
    { ...size }
  );
}
