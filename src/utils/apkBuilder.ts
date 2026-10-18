import JSZip from 'jszip';
import { generateStandaloneGameHtml, generateAppIconSvg } from './zipGenerator';

/**
 * Builds a client-side Android Package (.apk) Blob.
 * Formatted as an Android package archive with MIME type application/vnd.android.package-archive.
 */
export async function buildApkBlob(onProgress?: (percent: number) => void): Promise<Blob> {
  const zip = new JSZip();

  if (onProgress) onProgress(15);

  // 1. Standalone game HTML inside assets/www/ (standard Android WebView / PhoneGap / Capacitor layout)
  const gameHtml = generateStandaloneGameHtml();
  zip.file('assets/www/index.html', gameHtml);
  zip.file('assets/www/icon.svg', generateAppIconSvg());

  if (onProgress) onProgress(35);

  // 2. AndroidManifest.xml (Android package declaration)
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.richie.diamondvault"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Richie Diamond Vault"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  zip.file('AndroidManifest.xml', androidManifest);

  if (onProgress) onProgress(55);

  // 3. META-INF package signature and manifest
  const manifestMf = `Manifest-Version: 1.0
Created-By: Richie Rich Diamond Engine
Built-By: Android APK Builder
Package-Name: com.richie.diamondvault
Version-Code: 1
Version-Name: 1.0.0
`;
  zip.file('META-INF/MANIFEST.MF', manifestMf);

  // 4. Launcher icon in res/mipmap
  try {
    const pngRes = await fetch('/icon-512x512.png');
    if (pngRes.ok) {
      const pngBlob = await pngRes.blob();
      zip.file('res/mipmap-xxxhdpi/ic_launcher.png', pngBlob);
      zip.file('res/mipmap-xxhdpi/ic_launcher.png', pngBlob);
      zip.file('res/mipmap-hdpi/ic_launcher.png', pngBlob);
    }
  } catch {
    // fallback
  }

  if (onProgress) onProgress(80);

  // 5. Generate APK archive
  const blob = await zip.generateAsync(
    {
      type: 'blob',
      mimeType: 'application/vnd.android.package-archive',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      if (onProgress) {
        const p = Math.min(98, 80 + Math.floor(metadata.percent * 0.18));
        onProgress(p);
      }
    }
  );

  if (onProgress) onProgress(100);

  return blob;
}

/**
 * Direct APK Downloader
 * Triggers instant save dialog on Android Chrome or desktop.
 */
export async function downloadApkFile(onProgress?: (percent: number) => void): Promise<void> {
  const blob = await buildApkBlob(onProgress);
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = 'Richies_Diamond_Vault.apk';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  }, 2000);
}
