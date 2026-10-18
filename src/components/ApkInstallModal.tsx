import React, { useState, useEffect } from 'react';
import { Download, Check, Smartphone, X, Share2, Sparkles } from 'lucide-react';
import { downloadApkFile } from '../utils/apkBuilder';
import { sound } from '../utils/audio';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsBuilding(true);
      setProgress(5);
      setIsDone(false);

      // Trigger animated build sequence then real download
      let currentProgress = 5;
      const interval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress >= 90) {
          clearInterval(interval);
          // Build and download APK
          downloadApkFile((p) => setProgress(p))
            .then(() => {
              setProgress(100);
              setIsBuilding(false);
              setIsDone(true);
              sound.playVictory();
              if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            })
            .catch((err) => {
              console.error('APK build error', err);
              setIsBuilding(false);
            });
        } else {
          setProgress(currentProgress);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "Play Richie's Diamond Vault! Download the APK or play directly: " + window.location.href
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-stone-900 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-20 h-20 mb-3 relative">
          <img
            src="/icon-512x512.png"
            alt="Richie Diamond Vault App Icon"
            className="w-full h-full rounded-2xl border-3 border-amber-400 shadow-lg object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 p-1.5 rounded-xl border-2 border-white shadow-xs">
            <Smartphone className="w-4 h-4 text-amber-950" />
          </div>
        </div>

        <h3 className="text-xl font-black font-['Fredoka'] text-amber-950 mb-1">
          {isDone ? 'APK Downloaded!' : 'Building Your Mobile APK...'}
        </h3>
        <p className="text-xs font-bold text-amber-800 mb-4">
          Richies_Diamond_Vault.apk
        </p>

        {/* Progress Bar & percentage */}
        <div className="mb-5 bg-stone-100 border-2 border-amber-300 rounded-2xl p-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 mb-1.5 font-['Outfit']">
            <span>{isDone ? 'Packaging Complete' : 'Generating Android APK...'}</span>
            <span className="font-mono text-sm">{progress}%</span>
          </div>
          <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-150 shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps after download */}
        {isDone ? (
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 text-left mb-4 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>File saved to your Downloads!</span>
            </div>
            <ol className="text-[11px] font-semibold text-stone-700 list-decimal list-inside space-y-1">
              <li>Open your phone's <strong>Downloads</strong> or tap the notification.</li>
              <li>Tap <strong>Richies_Diamond_Vault.apk</strong>.</li>
              <li>Tap <strong>Install</strong>.</li>
              <li>Richie's game icon appears on your home screen!</li>
            </ol>
          </div>
        ) : (
          <p className="text-xs font-semibold text-stone-600 mb-4 animate-pulse">
            Packaging 6 levels, diamond audio, and assets into standalone APK...
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {isDone && (
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 font-['Outfit']"
            >
              <Share2 className="w-4 h-4" />
              <span>Share with Friends on WhatsApp</span>
            </button>
          )}

          <button
            onClick={() => downloadApkFile()}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 font-['Outfit'] border-2 border-amber-300"
          >
            <Download className="w-4 h-4" />
            <span>Download APK Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
