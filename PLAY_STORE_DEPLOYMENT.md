# Play Store Deployment — DuoWealth

DuoWealth uses Capacitor to wrap the Vercel deploy in an Android WebView.
This avoids Play Store in-app billing rules — Stripe Checkout happens in the browser.

## Prerequisites

- Android Studio installed
- Java 17+
- Node.js 18+

## Steps

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Add Android platform

```bash
npx cap add android
```

### 3. Sync

```bash
npx cap sync android
```

### 4. Generate keystore (one-time)

```bash
keytool -genkey -v -keystore duowealth.keystore \
  -alias duowealth -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore file securely — you need it for every release.

### 5. Configure signing in `android/app/build.gradle`

```groovy
android {
  signingConfigs {
    release {
      storeFile file('../../duowealth.keystore')
      storePassword System.getenv("KEYSTORE_PASSWORD")
      keyAlias 'duowealth'
      keyPassword System.getenv("KEY_PASSWORD")
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled false
    }
  }
}
```

### 6. Build release AAB

```bash
cd android
./gradlew bundleRelease
```

The AAB is at: `android/app/build/outputs/bundle/release/app-release.aab`

### 7. Upload to Play Console

1. Go to https://play.google.com/console
2. Create new app → "DuoWealth"
3. Production → Create new release
4. Upload the `.aab` file
5. Fill in store listing:
   - **Title**: DuoWealth — Budget Together
   - **Short description**: The budgeting app built for two. $5.99/mo per couple.
   - **Category**: Finance
6. Submit for review (~3 business days for first submission)

## App ID

`com.coryslsbry.duowealth`

## WebView URL

`https://duowealth.vercel.app`

All Stripe payments happen in the browser (external link), not via in-app purchase.
