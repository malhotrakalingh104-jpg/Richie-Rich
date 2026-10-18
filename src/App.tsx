import React, { useState, useEffect } from 'react';
import { ActiveGameTab, PlayerStats } from './types/game';
import { DownloadBanner } from './components/DownloadBanner';
import { Header } from './components/Header';
import { SwipeMatchGame } from './components/SwipeMatchGame';
import { SixLevelsGame } from './components/SixLevelsGame';
import { GemBlastGame } from './components/GemBlastGame';
import { VaultCatcherGame } from './components/VaultCatcherGame';
import { SafeMemoryGame } from './components/SafeMemoryGame';
import { MansionShowroom, STORE_ITEMS } from './components/MansionShowroom';
import { AdMobBannerPlaceholder } from './components/AdMobBannerPlaceholder';
import { sound } from './utils/audio';

const STORAGE_KEY = 'richie_rich_vault_v1';

const getInitialStats = (): PlayerStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return {
    diamonds: 250, // Starter diamonds for instant kid excitement!
    goldCoins: 1000,
    highScoreBlast: 0,
    highScoreCatcher: 0,
    safesCracked: 0,
    unlockedItemIds: []
  };
};

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(getInitialStats);
  const [activeTab, setActiveTab] = useState<ActiveGameTab>('swipe-match');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // safe fallback
    }
  }, [stats]);

  // Sync audio mute state
  const handleToggleSound = () => {
  const next = !soundOn;
  setSoundOn(next);
  sound.enabled = false; // mute all
  sound.voiceEnabled = false; // NO RICHIE VOICE
};

  // Earn diamonds handler
  const handleEarnDiamonds = (count: number) => {
    setStats((prev) => ({
      ...prev,
      diamonds: prev.diamonds + count
    }));
  };

  // High score updates
  const handleUpdateHighScoreBlast = (newScore: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreBlast: Math.max(prev.highScoreBlast, newScore)
    }));
  };

  const handleUpdateHighScoreCatcher = (newScore: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreCatcher: Math.max(prev.highScoreCatcher, newScore)
    }));
  };

  const handleSafeCracked = () => {
    setStats((prev) => ({
      ...prev,
      safesCracked: prev.safesCracked + 1
    }));
  };

  const handleUnlockItem = (itemId: string, cost: number) => {
    setStats((prev) => ({
      ...prev,
      diamonds: Math.max(0, prev.diamonds - cost),
      unlockedItemIds: [...prev.unlockedItemIds, itemId]
    }));
  };

  // Passive toy diamonds generator: Mansion toys generate passive income every 15 seconds!
  useEffect(() => {
    const interval = setInterval(() => {
      let passiveTotal = 0;
      stats.unlockedItemIds.forEach((id) => {
        const item = STORE_ITEMS.find((s) => s.id === id);
        if (item?.rewardDiamondsPerSec) {
          passiveTotal += item.rewardDiamondsPerSec * 2;
        }
      });

      if (passiveTotal > 0) {
        setStats((prev) => ({
          ...prev,
          diamonds: prev.diamonds + passiveTotal
        }));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [stats.unlockedItemIds]);

  return (
    <div
      className="min-h-screen text-stone-900 flex flex-col font-['Outfit'] selection:bg-amber-300 selection:text-amber-950 bg-cover bg-fixed bg-center relative"
      style={{
        backgroundImage: `url('/src/assets/images/richie_indoor_mansion_1792220699979.jpg')`,
      }}
    >
      {/* Prominent Direct In-Browser ZIP Downloader Banner */}
      <DownloadBanner />

      {/* Universal Top Bar - Solid White */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        diamonds={stats.diamonds}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-3 sm:py-6">
        {activeTab === 'swipe-match' && (
          <SwipeMatchGame
            onEarnDiamonds={handleEarnDiamonds}
            onGoToShop={() => setActiveTab('mansion-vault')}
          />
        )}

        {activeTab === 'six-levels' && (
          <SixLevelsGame
            onEarnDiamonds={handleEarnDiamonds}
            onGoToShop={() => setActiveTab('mansion-vault')}
          />
        )}

        {activeTab === 'gem-blast' && (
          <GemBlastGame
            onEarnDiamonds={handleEarnDiamonds}
            highScore={stats.highScoreBlast}
            onUpdateHighScore={handleUpdateHighScoreBlast}
            onGoToShop={() => setActiveTab('mansion-vault')}
          />
        )}

        {activeTab === 'vault-catcher' && (
          <VaultCatcherGame
            onEarnDiamonds={handleEarnDiamonds}
            highScore={stats.highScoreCatcher}
            onUpdateHighScore={handleUpdateHighScoreCatcher}
            onGoToShop={() => setActiveTab('mansion-vault')}
          />
        )}

        {activeTab === 'safe-cracker' && (
          <SafeMemoryGame
            onEarnDiamonds={handleEarnDiamonds}
            safesCracked={stats.safesCracked}
            onSafeCracked={handleSafeCracked}
            onGoToShop={() => setActiveTab('mansion-vault')}
          />
        )}

        {activeTab === 'mansion-vault' && (
          <MansionShowroom
            diamonds={stats.diamonds}
            unlockedItemIds={stats.unlockedItemIds}
            onUnlockItem={handleUnlockItem}
          />
        )}
      </main>
    {/* Richie Rich Diamond Hero - NEW CHARACTER */}
<div className="flex flex-col items-center justify-center py-8">
  <img 
    src="/richie.png" 
    alt="Richie Rich Diamond" 
    className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
  />
  <p className="mt-4 text-xl font-bold text-amber-900 animate-pulse">
    💎 Welcome to My Diamond Vault! 💎
  </p>
</div>

      {/* Quiet, clean kid-safe footer - Solid White */}
      <footer className="border-t-2 border-amber-300 bg-white py-4 px-6 text-center text-xs text-stone-600 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-amber-950">
            Richie's Diamond Vault · Indoor Play Palace & Diamond Games for Kids
          </p>
          <div className="flex items-center gap-4 text-stone-500 font-semibold">
            <span>Sparkling Gems</span>
            <span>·</span>
            <span>Billionaire Toys</span>
            <span>·</span>
            <span>Safe & Fun</span>
          </div>
        </div>
      </footer>

      {/* AdMob Banner Placeholder (Bottom-Right, 320x50 standard unit) */}
      <AdMobBannerPlaceholder />
    </div>
  );
}
