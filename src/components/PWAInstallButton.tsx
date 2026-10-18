import React, { useState } from 'react';
import { Smartphone, Download, X, Check, Package, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/audio';
import { generatePlayStorePackage } from '../utils/packageExporter';
import { downloadApkFile } from '../utils/apkBuilder';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  const handleInstallClick = async () => {
    sound.playCatch();
    if (isInstallable) {
      const success = await install();
      if (success) {
        sound.playVictory();
        return;
      }
    }
    setShowModal(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      sound.playCatch();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPlayStoreZip = async () => {
    try {
      setIsDownloadingZip(true);
      sound.playCatch();
      const zipBlob = await generatePlayStorePackage();
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Kid_Billionaire_Diamond_Vault_PlayStore_Package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipDownloaded(true);
      sound.playVictory();
      setTimeout(() => setZipDownloaded(false), 4000);
    } catch (err) {
      console.error('Failed to generate Play Store zip package', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Outfit'] border-2 border-amber-300 shrink-0"
          title="Install on phone or download for Google Play Store"
        >
          <Smartphone className="w-4 h-4 text-amber-900" />
          <span>Install / Play Store</span>
        </button>
      </div>

      {/* Helpful Install & Play Store Modal - 100% Solid Background */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-stone-900 overflow-hidden my-8">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon & Title */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="/pwa-192x192.png"
                alt="Richie Gems app icon"
                className="w-14 h-14 rounded-2xl border-2 border-amber-400 shadow-md object-cover shrink-0"
              />
              <div>
                <h3 className="text-xl font-black font-['Fredoka'] text-amber-950 leading-tight">
                  Play Store & Mobile Trial
                </h3>
                <p className="text-xs font-bold text-amber-700">
                  Instant phone install & Google Play release package
                </p>
              </div>
            </div>

            {/* SECTION 0: DIRECT MOBILE APK DOWNLOAD */}
            <div className="bg-gradient-to-r from-amber-200 to-yellow-200 border-3 border-amber-500 rounded-2xl p-4 mb-4 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-sm font-black text-amber-950 font-['Outfit']">
                <Smartphone className="w-5 h-5 text-amber-900" />
                <span>DIRECT ANDROID APK DOWNLOAD</span>
              </div>
              <p className="text-xs font-bold text-amber-900 mb-3">
                Download Richie's Diamond Vault (.apk) to install on Android phone or send on WhatsApp!
              </p>
              <button
                onClick={async () => {
                  sound.playCatch();
                  await downloadApkFile();
                  sound.playVictory();
                }}
                className="w-full py-3 bg-stone-900 hover:bg-black text-amber-300 font-black rounded-xl text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] border-2 border-amber-400"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>DOWNLOAD Richies_Diamond_Vault.apk</span>
              </button>
            </div>

            {/* SECTION 1: DOWNLOAD PLAY STORE & OFFLINE GAME PACKAGE (ZIP) */}
            <div className="bg-amber-100/70 border-2 border-amber-400 rounded-2xl p-4 mb-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-amber-950 font-['Outfit']">
                <Package className="w-5 h-5 text-amber-700" />
                <span>1. Download Offline Game & Play Store Package (.ZIP)</span>
              </div>
              <p className="text-xs font-semibold text-stone-700 mb-3 leading-relaxed">
                Contains the <strong>full playable offline game</strong> (open index.html to play offline without internet!), Android project configs (<code className="bg-white px-1.5 py-0.5 rounded text-amber-900 font-mono text-[11px]">AndroidManifest.xml</code>), HD app icons, and step-by-step Google Play publishing guide.
              </p>

              <a
                href="/Kid_Billionaire_Diamond_Vault_PlayStore_Package.zip"
                download="Kid_Billionaire_Diamond_Vault_PlayStore_Package.zip"
                onClick={() => sound.playVictory()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-amber-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer font-['Outfit'] border-2 border-white no-underline text-center"
              >
                <Download className="w-4 h-4 text-amber-950" />
                <span>Download Game & Play Store ZIP (2.5 MB)</span>
              </a>
            </div>

            {/* SECTION 2: HOW TO GET SIGNED .AAB FOR GOOGLE PLAY */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 mb-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-stone-900 font-['Outfit']">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. How to get the Google Play .AAB in 2 minutes:</span>
              </div>
              <p className="text-xs font-semibold text-stone-600 mb-2 leading-relaxed">
                Google Play requires an <strong>.AAB (Android App Bundle)</strong> instead of plain APKs for new apps. You can generate it for free:
              </p>
              <ol className="text-xs font-semibold text-stone-700 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Go to official <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-amber-800 underline font-bold inline-flex items-center gap-0.5">PWABuilder.com <ExternalLink className="w-3 h-3" /></a></li>
                <li>Enter this live game URL: <span className="font-mono text-[10px] bg-stone-100 px-1 py-0.5 rounded">ais-pre-ahtscvo3amzqflxbmegasz-980099308157...</span></li>
                <li>Click <strong>Package for Stores → Android (Google Play)</strong>.</li>
                <li>Download your signed <strong>.aab</strong> bundle and upload to <strong>Google Play Console</strong>!</li>
              </ol>
            </div>

            {/* COPYRIGHT NOTICE WARNING */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 mb-4 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-rose-950 leading-snug">
                <strong>Important Play Store Policy:</strong> Do NOT use "Richie Rich" as your Google Play app title (it is a copyrighted trademark). Use <em>"Kid Billionaire: Diamond Vault"</em> or <em>"Little Rich: Gem Rush"</em> to prevent store suspension!
              </p>
            </div>

            {/* INSTANT PHONE TRIAL (WEBAPK) */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <span className="block text-xs font-black text-stone-900">
                  📱 Try Right Now on Android:
                </span>
                <span className="text-[11px] font-medium text-stone-600">
                  Open in Chrome on Android → Tap "Install app" for instant WebAPK!
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied!' : 'Copy Game Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
