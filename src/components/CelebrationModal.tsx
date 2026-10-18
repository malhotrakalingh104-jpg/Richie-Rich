import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  score: number;
  gemsEarned: number;
  onPlayAgain: () => void;
  onGoToShop?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  title,
  subtitle,
  score,
  gemsEarned,
  onPlayAgain,
  onGoToShop
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      sound.cheer(title);

      // Trigger colorful kid confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#38BDF8', '#EF4444', '#10B981', '#8B5CF6']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, title]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        {/* Mascot & Trophy header */}
        <div className="mx-auto w-24 h-24 mb-4 relative">
          <img
            src="/src/assets/images/richie_mascot_1792220316497.jpg"
            alt="Richie Rich celebration"
            className="w-full h-full rounded-2xl border-4 border-amber-400 shadow-lg object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-2 rounded-xl shadow-md border-2 border-white">
            <Trophy className="w-5 h-5 text-amber-950" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-['Fredoka'] mb-1">
          {title}
        </h2>
        <p className="text-sm font-bold text-amber-900 mb-6">
          {subtitle}
        </p>

        {/* Score and Gems earned - 100% solid cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 shadow-sm">
            <span className="block text-xs font-black text-stone-500 uppercase tracking-wide">
              Final Score
            </span>
            <span className="font-mono tabular-nums text-2xl font-black text-amber-950">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#FEF9C3] border-2 border-amber-300 rounded-2xl p-3 shadow-sm">
            <span className="block text-xs font-black text-amber-800 uppercase tracking-wide">
              Gems Collected
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="font-mono tabular-nums text-2xl font-black text-amber-950">
                +{gemsEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again!
          </button>

          {onGoToShop && (
            <button
              onClick={onGoToShop}
              className="w-full sm:flex-1 py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit']"
            >
              Mansion Toys
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
