import React from 'react';
import { Smartphone, Download, X, Share2, CheckCircle2, Apple, Play } from 'lucide-react';
import { downloadOfflineHtmlFile } from '../utils/downloadOfflineHtml';
import { sound } from '../utils/audio';

interface PhoneAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneAppModal: React.FC<PhoneAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playCatch();
    downloadOfflineHtmlFile();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "Hey! Here is Richie's Diamond Vault game. Download and double-click to play offline with zero login!"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-900 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-400 border-2 border-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
            📱
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-['Fredoka'] text-amber-950">
              Install as Phone App
            </h3>
            <p className="text-xs font-bold text-amber-800">
              Zero App Store needed · 100% Offline · No Login
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left text-xs font-medium text-stone-800">
          {/* Android Guide */}
          <div className="bg-white border-2 border-emerald-300 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-emerald-900 text-sm mb-2">
              <span className="text-base">🤖</span>
              <span>For Android (Samsung, Pixel, Xiaomi, OnePlus)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 font-semibold text-stone-700">
              <li>
                Download <strong className="text-amber-950">Richie-Diamond-Vault-OFFLINE.html</strong> to your phone or send it via WhatsApp.
              </li>
              <li>Open the file in <strong>Google Chrome</strong>.</li>
              <li>
                Tap the top-right <strong>three dots menu (⋮)</strong>.
              </li>
              <li>
                Select <strong className="text-emerald-800">"Add to Home screen"</strong> or <strong className="text-emerald-800">"Install app"</strong>.
              </li>
              <li>
                The Richie Rich diamond icon will be placed directly on your phone home screen!
              </li>
            </ol>
          </div>

          {/* iPhone Guide */}
          <div className="bg-white border-2 border-sky-300 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-sky-900 text-sm mb-2">
              <span className="text-base">🍏</span>
              <span>For iPhone & iPad (Safari)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 font-semibold text-stone-700">
              <li>Open the HTML file in <strong>Safari</strong>.</li>
              <li>
                Tap the <strong>Share button</strong> (square icon with an arrow pointing up at the bottom).
              </li>
              <li>
                Scroll down and tap <strong className="text-sky-800">"Add to Home Screen"</strong>.
              </li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
              <li>Tap the icon anytime to play full-screen offline!</li>
            </ol>
          </div>

          {/* Guarantee */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 flex items-center gap-2 text-[11px] font-bold text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Never requires internet, passwords, or permissions to play!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t-2 border-amber-200 flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 border-2 border-amber-300 font-['Outfit']"
          >
            <Download className="w-4 h-4 text-amber-950" />
            <span>Download OFFLINE Game File Now (45 KB)</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95 font-['Outfit']"
          >
            <Share2 className="w-4 h-4" />
            <span>Send Instructions on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
