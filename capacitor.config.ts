import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coryslsbry.duowealth',
  appName: 'DuoWealth',
  webDir: 'public',
  server: {
    // Load the Vercel deploy via WebView — keeps Stripe Checkout in the browser
    // and avoids Play Store in-app billing policy requirements.
    url: 'https://duowealth.vercel.app',
    androidScheme: 'https',
  },
};

export default config;
