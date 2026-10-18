import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ActiveGameTab } from '../types/game';
import { sound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: ActiveGameTab;
  onTabChange: (tab: ActiveGameTab) => void;
  diamonds: number;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  diamonds,
  soundOn,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-amber-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onTabChange('gem-blast')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-100 flex items-center justify-center shadow-sm border border-amber-300 group-hover:scale-105 transition-transform">
            <span className="text-xl">💎</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-amber-950 tracking-tight font-['Fredoka'] leading-none">
              Richie's Diamond Vault
            </span>
            <span className="text-[11px] font-semibold text-amber-700/80 tracking-wide uppercase">
              Billionaire Kids Club
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => {
              onTabChange('swipe-match');
              sound.playCatch();
            }}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'swipe-match'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🍬 Swipe Crush
          </button>

          <button
            onClick={() => {
              onTabChange('six-levels');
              sound.playCatch();
            }}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'six-levels'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🏰 6 Levels Game
          </button>

          <button
            onClick={() => {
              onTabChange('gem-blast');
              sound.playCatch();
            }}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'gem-blast'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            💎 Diamond Blast
          </button>

          <button
            onClick={() => {
              onTabChange('vault-catcher');
              sound.playCatch();
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'vault-catcher'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🛒 Vault Catcher
          </button>

          <button
            onClick={() => {
              onTabChange('safe-cracker');
              sound.playCatch();
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'safe-cracker'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🔐 Safe Cracker
          </button>

          <button
            onClick={() => {
              onTabChange('mansion-vault');
              sound.playCatch();
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer font-['Outfit'] ${
              activeTab === 'mansion-vault'
                ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🏰 Mansion Toys
          </button>
        </nav>

        {/* Zone 3: Primary Status / Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Diamond Vault Count */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300/80 px-3 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span className="font-mono tabular-nums font-extrabold text-amber-950 text-sm sm:text-base">
              {diamonds.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-amber-700 hidden md:inline">GEMS</span>
          </div>

          {/* In-App Install App Button (Android WebAPK / iOS PWA) */}
          <PWAInstallButton />

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
