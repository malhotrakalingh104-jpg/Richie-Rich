import React, { useState } from 'react';
import { Smartphone, Download, Globe, Share2, Sparkles, Check } from 'lucide-react';
import { PhoneAppModal } from './PhoneAppModal';
import { PublicLinkModal } from './PublicLinkModal';
import { ApkInstallModal } from './ApkInstallModal';
import { downloadOfflineHtmlFile } from '../utils/downloadOfflineHtml';
import { sound } from '../utils/audio';

export const DownloadBanner: React.FC = () => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPublicLinkModal, setShowPublicLinkModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadOfflineGame = () => {
    sound.playVictory();
    downloadOfflineHtmlFile();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-4 border-amber-600 shadow-xl px-2.5 sm:px-4 py-2 text-stone-950 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Left badge */}
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">💎</span>
            <div className="flex flex-col text-left">
              <span className="font-black text-xs sm:text-sm font-['Fredoka'] text-amber-950 uppercase tracking-tight flex items-center gap-1.5">
                <span>Public Offline Game</span>
                <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                  No Login Needed
                </span>
              </span>
              <span className="text-[10px] font-bold text-amber-900 hidden sm:inline">
                Single file under 100KB · Double-click to play · Send on WhatsApp
              </span>
            </div>
          </div>

          {/* 3 Main Action Buttons Requested by User */}
          <div className="flex items-center flex-wrap justify-center gap-1.5 sm:gap-2">
            {/* Button 1: Download OFFLINE Game (Send to Friends) */}
            <button
              onClick={handleDownloadOfflineGame}
              className="px-3.5 sm:px-5 py-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg border-2 border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 font-['Outfit'] animate-pulse hover:animate-none"
              title="Download single HTML file to send to friends on WhatsApp or double-click to play"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Downloaded HTML!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span className="uppercase tracking-tight">📥 Download OFFLINE Game</span>
                </>
              )}
            </button>

            {/* Button 2: Install as Phone App */}
            <button
              onClick={() => {
                sound.playCatch();
                setShowPhoneModal(true);
              }}
              className="px-3 py-2 bg-white hover:bg-amber-50 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-md border-2 border-amber-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 font-['Outfit']"
              title="Instructions to add game to Android or iPhone home screen without App Store"
            >
              <Smartphone className="w-4 h-4 text-amber-800" />
              <span>📱 Install as Phone App</span>
            </button>

            {/* Button 3: Create Public Link */}
            <button
              onClick={() => {
                sound.playCatch();
                setShowPublicLinkModal(true);
              }}
              className="px-3 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-md border-2 border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 font-['Outfit']"
              title="Get a free 24/7 public link on Netlify Drop, Itch.io, or GitHub Pages"
            >
              <Globe className="w-4 h-4 text-amber-900" />
              <span>🔗 Create Public Link</span>
            </button>

            {/* Bonus: APK Phone Download */}
            <button
              onClick={() => {
                sound.playCatch();
                setShowApkModal(true);
              }}
              className="px-2.5 py-2 bg-stone-900 hover:bg-black text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 font-['Outfit'] hidden lg:flex"
              title="Download Android APK package"
            >
              <span>🤖 APK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhoneAppModal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
      <PublicLinkModal isOpen={showPublicLinkModal} onClose={() => setShowPublicLinkModal(false)} />
      <ApkInstallModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </>
  );
};
