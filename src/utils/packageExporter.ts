import JSZip from 'jszip';

export async function generatePlayStorePackage(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Android Manifest configuration (TWA / Bubblewrap)
  const twaManifest = {
    packageId: 'com.kidbillionaire.diamondvault',
    host: 'ais-pre-ahtscvo3amzqflxbmegasz-980099308157.asia-southeast1.run.app',
    name: "Kid Billionaire: Diamond Vault",
    launcherName: "DiamondVault",
    themeColor: "#F59E0B",
    navigationColor: "#FFFBEB",
    backgroundColor: "#FFFBEB",
    enableNotifications: true,
    startUrl: "/",
    iconUrl: "/pwa-512x512.png",
    maskableIconUrl: "/icon.svg",
    appVersion: "1.0.0",
    appVersionCode: 1,
    signing: {
      keyPassword: "password",
      alias: "android",
      storePassword: "password"
    }
  };

  zip.file('twa-manifest.json', JSON.stringify(twaManifest, null, 2));

  // 2. Web App Manifest
  const webManifest = {
    id: "/",
    name: "Kid Billionaire: Diamond Vault",
    short_name: "DiamondVault",
    description: "Fun, kid-friendly diamond popping and jewel catching game for kids below 10.",
    theme_color: "#F59E0B",
    background_color: "#FFFBEB",
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };

  zip.file('manifest.json', JSON.stringify(webManifest, null, 2));

  // 3. Android AndroidManifest.xml template
  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kidbillionaire.diamondvault">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Kid Billionaire"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  zip.file('android/AndroidManifest.xml', androidManifestXml);

  // 4. Detailed Google Play Store Publishing & Monetization Guide
  const guideContent = `# Google Play Store Publishing & Monetization Guide

Congratulations on preparing your game for the Google Play Store!

---

## ⚠️ CRITICAL NOTICE REGARDING COPYRIGHT & GOOGLE PLAY POLICY
- **Do NOT use the name "Richie Rich" in your Google Play Store title, description, or icon.**
- "Richie Rich" is an active registered trademark owned by Classic Media / DreamWorks / NBCUniversal.
- If you upload with the name "Richie Rich", Google Play will automatically reject your app or suspend your developer account for IP violation.
- **Recommended Safe Store Title:** 
  - *"Kid Billionaire: Diamond Vault"*
  - *"Little Rich: Gem Rush"*
  - *"Diamond Vault: Kids Gem Game"*

---

## METHOD 1: Instant .AAB / .APK Generation via PWABuilder (Easiest & Fastest, 2 Minutes)

Google Play Store now requires an **.AAB (Android App Bundle)** file instead of raw APKs for all new apps. You can generate a signed Play Store package for free in 2 minutes:

1. Visit **https://www.pwabuilder.com** in your browser.
2. In the URL box, enter your live app URL:
   \`https://ais-pre-ahtscvo3amzqflxbmegasz-980099308157.asia-southeast1.run.app\`
3. Click **"Start"**.
4. PWABuilder will automatically verify the PWA manifests, icons, and service worker.
5. Click **"Package for Stores"** -> Select **"Android (Google Play)"**.
6. Set your package ID (e.g. \`com.yourname.diamondvault\`).
7. Click **"Generate Package"**.
8. Download your signed **.aab** file and asset credentials!
9. Upload this **.aab** file directly to your **Google Play Console** dashboard!

---

## METHOD 2: Using Bubblewrap CLI / Android Studio

If you prefer building locally on your computer with Node.js & Android SDK:

\`\`\`bash
# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project from your live game URL
bubblewrap init --manifest=https://ais-pre-ahtscvo3amzqflxbmegasz-980099308157.asia-southeast1.run.app/manifest.webmanifest

# 3. Build signed Android App Bundle (.aab) and APK
bubblewrap build
\`\`\`

---

## HOW TO MONETIZE AND EARN MONEY ON GOOGLE PLAY

1. **Google AdMob (Rewarded Video & Banner Ads)**:
   - Sign up at https://admob.google.com
   - Set up Rewarded Ads (e.g., "Watch a quick cartoon ad to get +500 Free Diamonds!"). Kids love unlocking toys with free reward diamonds!
2. **Google Play In-App Purchases (IAP)**:
   - Offer coin / diamond packages (e.g. "$0.99 for 5,000 Diamonds" or "$1.99 to Unlock All Mansion Toys").
3. **Paid App (Premium Game)**:
   - Sell the game as a one-time purchase ($1.99 or $2.99) for kids and parents with zero ads.
`;

  zip.file('PLAY_STORE_GUIDE.md', guideContent);

  // 5. Fetch and include icon files if accessible
  try {
    const iconRes = await fetch('/icon.svg');
    if (iconRes.ok) {
      const iconBlob = await iconRes.blob();
      zip.file('icon.svg', iconBlob);
    }
  } catch {
    // fallback
  }

  try {
    const pngRes = await fetch('/pwa-512x512.png');
    if (pngRes.ok) {
      const pngBlob = await pngRes.blob();
      zip.file('pwa-512x512.png', pngBlob);
      zip.file('pwa-192x192.png', pngBlob);
      zip.file('android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', pngBlob);
    }
  } catch {
    // fallback
  }

  return await zip.generateAsync({ type: 'blob' });
}
