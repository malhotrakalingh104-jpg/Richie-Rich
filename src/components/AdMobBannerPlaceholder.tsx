import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * AdMob Banner Placeholder (320x50 Standard Banner)
 * Ready for Google Play Store monetization integration.
 *
 * HOW TO INTEGRATE REAL ADMOB LATER:
 * 1. Sign up at https://admob.google.com
 * 2. Create an App and get your App ID (ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY)
 * 3. Create a Banner Ad unit and get your Ad Unit ID (ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ)
 * 4. Install Capacitor AdMob plugin: npm install @capacitor-community/admob
 * 5. Call AdMob.showBanner({ adId: 'YOUR_BANNER_AD_UNIT_ID', position: BannerAdPosition.BOTTOM_CENTER })
 */
export const AdMobBannerPlaceholder: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-30 flex flex-col items-end select-none">
      {/* Toggle button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="mb-1 px-2 py-0.5 bg-stone-800 text-stone-300 hover:text-white rounded-md text-[10px] font-bold flex items-center gap-1 border border-stone-600 shadow-sm cursor-pointer transition-colors"
        title={isMinimized ? "Show AdMob banner placeholder" : "Minimize placeholder"}
      >
        {isMinimized ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-stone-400" />}
        <span>AdMob (320×50)</span>
      </button>

      {!isMinimized && (
        <div className="w-[320px] h-[50px] bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-2 border-dashed border-amber-400/80 rounded-xl shadow-2xl flex items-center justify-between px-3 overflow-hidden text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">
              Ad
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-amber-300 font-['Outfit'] leading-tight">
                AdMob Banner Placeholder
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                ca-app-pub-placeholder / 320×50
              </span>
            </div>
          </div>

          <div className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-1 rounded font-bold border border-amber-400/30">
            TEST AD
          </div>
        </div>
      )}
    </div>
  );
};
