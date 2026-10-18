import React, { useState } from 'react';
import { Sparkles, Check, Lock, Gift, Volume2 } from 'lucide-react';
import { StoreItem } from '../types/game';
import { sound } from '../utils/audio';
import { RichieMascotBox } from './RichieMascotBox';
import confetti from 'canvas-confetti';

interface MansionShowroomProps {
  diamonds: number;
  unlockedItemIds: string[];
  onUnlockItem: (itemId: string, cost: number) => void;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'dollar-dog',
    name: 'Dollar the Diamond Dog',
    cost: 500,
    unlocked: false,
    category: 'friends',
    description: "Richie's faithful pup wearing a solid diamond collar! He loves catching gold frisbees.",
    icon: '🐶',
    rewardDiamondsPerSec: 1
  },
  {
    id: 'ice-cream-machine',
    name: 'Gold Ice Cream Fountain',
    cost: 1200,
    unlocked: false,
    category: 'treats',
    description: 'Pumps unlimited vanilla, chocolate, and golden berry swirls into crystal bowls!',
    icon: '🍦',
    rewardDiamondsPerSec: 2
  },
  {
    id: 'gold-gokart',
    name: 'Solid Gold Go-Kart',
    cost: 2500,
    unlocked: false,
    category: 'vehicles',
    description: 'Equipped with 24-karat rims and sparkling diamond headlights that light up the driveway!',
    icon: '🏎️',
    rewardDiamondsPerSec: 5
  },
  {
    id: 'irona-robot',
    name: 'Irona the Robot Butler',
    cost: 4500,
    unlocked: false,
    category: 'friends',
    description: 'Super-smart robot who cleans with laser dusters and makes fresh fruit smoothies!',
    icon: '🤖',
    rewardDiamondsPerSec: 8
  },
  {
    id: 'diamond-copter',
    name: 'Diamond Sky Helicopter',
    cost: 7000,
    unlocked: false,
    category: 'vehicles',
    description: 'A personal twin-rotor mini-copter that lands right next to the mansion rooftop pool!',
    icon: '🚁',
    rewardDiamondsPerSec: 12
  },
  {
    id: 'billionaire-crown',
    name: 'Royal Diamond Crown',
    cost: 10000,
    unlocked: false,
    category: 'luxuries',
    description: 'Handcrafted with 100 giant glowing diamonds. Fits perfectly on a billionaire kid!',
    icon: '👑',
    rewardDiamondsPerSec: 20
  },
  {
    id: 'space-rocket',
    name: 'Richie Gold Space Rocket',
    cost: 15000,
    unlocked: false,
    category: 'vehicles',
    description: 'Blast off to the outer space diamond nebula to mine interstellar gems!',
    icon: '🚀',
    rewardDiamondsPerSec: 35
  }
];

export const MansionShowroom: React.FC<MansionShowroomProps> = ({
  diamonds,
  unlockedItemIds,
  onUnlockItem
}) => {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [richieMessage, setRichieMessage] = useState<string>(
    "Welcome to my mansion! Spend your sparkling diamonds to unlock crazy billionaire toys!"
  );

  const handlePurchase = (item: StoreItem) => {
    if (diamonds < item.cost) {
      sound.playSafeTone(0);
      setRichieMessage(`You need ${(item.cost - diamonds).toLocaleString()} more diamonds for the ${item.name}! Play more games to collect them!`);
      return;
    }

    onUnlockItem(item.id, item.cost);
    sound.playVictory();
    sound.playRainbowExplosion();
    sound.cheer(`Awesome! You unlocked the ${item.name}!`);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#38BDF8', '#10B981', '#EC4899']
      });
    } catch {
      // safe fallback
    }

    setRichieMessage(`Hurray! The ${item.name} is now delivered to the mansion courtyard!`);
  };

  const handleInteract = (item: StoreItem) => {
    sound.playCatch();
    setSelectedItem(item);

    if (item.id === 'dollar-dog') {
      sound.cheer("Woof! Dollar says thank you for the diamond collar!");
    } else if (item.id === 'gold-gokart') {
      sound.cheer("Vroom vroom! Solid gold engine roaring!");
    } else if (item.id === 'ice-cream-machine') {
      sound.cheer("Yum! Triple golden sundae served!");
    } else if (item.id === 'irona-robot') {
      sound.cheer("Beep boop! Irona at your service, Young Master!");
    } else if (item.id === 'diamond-copter') {
      sound.cheer("Chopper rotors spinning up for flight!");
    } else if (item.id === 'billionaire-crown') {
      sound.cheer("Hail to the Diamond Monarch!");
    } else if (item.id === 'space-rocket') {
      sound.cheer("3, 2, 1, Liftoff to the Diamond Stars!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Vault Wealth Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-3xl p-6 sm:p-8 border-3 border-amber-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 text-center md:text-left">
          <span className="text-xs font-black tracking-widest uppercase text-amber-950 font-['Fredoka']">
            Richie's Toy Collection & Vault
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-amber-950 font-['Fredoka'] mt-1">
            Billionaire Kid Emporium
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1 max-w-lg">
            Unlocked: {unlockedItemIds.length} of {STORE_ITEMS.length} luxury toys and mansion treasures!
          </p>
        </div>

        {/* Current Available Diamonds */}
        <div className="relative z-10 flex items-center gap-3 bg-white border-3 border-amber-400 px-5 py-3 rounded-2xl shadow-md">
          <span className="text-3xl">💎</span>
          <div>
            <span className="block text-[11px] font-black text-amber-800 uppercase tracking-wide">
              Vault Balance
            </span>
            <span className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-950">
              {diamonds.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Richie Mascot Tips */}
      <RichieMascotBox message={richieMessage} />

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STORE_ITEMS.map((item) => {
          const isUnlocked = unlockedItemIds.includes(item.id);
          const canAfford = diamonds >= item.cost;

          return (
            <div
              key={item.id}
              className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md hover:scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-amber-200 shadow-xs'
              }`}
            >
              <div>
                {/* Header with big icon and status */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => (isUnlocked ? handleInteract(item) : null)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                      isUnlocked
                        ? 'bg-amber-100 border-amber-300 cursor-pointer animate-pulse hover:scale-110 transition-transform'
                        : 'bg-stone-100 border-stone-200 opacity-70'
                    }`}
                    title={isUnlocked ? 'Tap to play with this toy!' : 'Locked toy'}
                  >
                    {item.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full font-['Outfit']">
                      <Check className="w-3.5 h-3.5" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                      <Lock className="w-3.5 h-3.5" />
                      LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-amber-950 font-['Fredoka'] mb-1">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-stone-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom action button */}
              <div className="pt-3 border-t border-stone-100">
                {isUnlocked ? (
                  <button
                    onClick={() => handleInteract(item)}
                    className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-['Outfit']"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    Tap to Play with Toy!
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-['Outfit'] ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm hover:scale-[1.02]'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlock for {item.cost.toLocaleString()} 💎
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
