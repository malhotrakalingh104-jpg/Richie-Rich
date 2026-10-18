import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, Lock, Unlock, Play, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { GemIcon } from './GemIcon';
import { GemType } from '../types/game';
import { sound } from '../utils/audio';
import { CelebrationModal } from './CelebrationModal';
import { RichieMascotBox } from './RichieMascotBox';

interface SafeMemoryGameProps {
  onEarnDiamonds: (count: number) => void;
  safesCracked: number;
  onSafeCracked: () => void;
  onGoToShop: () => void;
}

interface GemButtonDef {
  type: GemType;
  name: string;
  color: string;
  glowClass: string;
  soundIndex: number;
}

const SAFE_GEMS: GemButtonDef[] = [
  { type: 'diamond', name: 'Diamond', color: 'bg-sky-400', glowClass: 'ring-sky-300 bg-sky-100', soundIndex: 1 },
  { type: 'ruby', name: 'Ruby', color: 'bg-red-500', glowClass: 'ring-red-300 bg-red-100', soundIndex: 2 },
  { type: 'emerald', name: 'Emerald', color: 'bg-emerald-500', glowClass: 'ring-emerald-300 bg-emerald-100', soundIndex: 3 },
  { type: 'topaz', name: 'Topaz', color: 'bg-amber-400', glowClass: 'ring-amber-300 bg-amber-100', soundIndex: 4 }
];

export const SafeMemoryGame: React.FC<SafeMemoryGameProps> = ({
  onEarnDiamonds,
  safesCracked,
  onSafeCracked,
  onGoToShop
}) => {
  const [level, setLevel] = useState<number>(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [activeGemIndex, setActiveGemIndex] = useState<number | null>(null);
  const [isSafeUnlocked, setIsSafeUnlocked] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [diamondsWon, setDiamondsWon] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [richieMessage, setRichieMessage] = useState<string>(
    "Listen to the musical gems and watch the lights to crack my secret gold safe!"
  );

  // Play a single gem tone and illuminate it
  const flashGem = useCallback((index: number, duration = 400): Promise<void> => {
    return new Promise((resolve) => {
      setActiveGemIndex(index);
      sound.playSafeTone(SAFE_GEMS[index].soundIndex);
      setTimeout(() => {
        setActiveGemIndex(null);
        setTimeout(resolve, 150);
      }, duration);
    });
  }, []);

  // Play the full current sequence
  const playSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    setRichieMessage("Watch closely! Remembering the gems...");
    await new Promise((r) => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      await flashGem(seq[i], 450);
    }

    setIsShowingSequence(false);
    setPlayerStep(0);
    setRichieMessage("Your turn! Tap the gems in the exact order!");
  }, [flashGem]);

  // Start / Advance to next safe level
  const startLevel = useCallback((lvl: number) => {
    const sequenceLength = 2 + lvl; // level 1 has 3 gems, level 2 has 4 gems
    const newSeq: number[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSeq.push(Math.floor(Math.random() * SAFE_GEMS.length));
    }
    setSequence(newSeq);
    setPlayerStep(0);
    setIsSafeUnlocked(false);
    setHasStarted(true);
    playSequence(newSeq);
  }, [playSequence]);

  // First start
  const handleStartGame = () => {
    setLevel(1);
    setRoundScore(0);
    setDiamondsWon(0);
    startLevel(1);
    sound.playCatch();
  };

  // Replay hint for kid if they forgot
  const handleReplayHint = () => {
    if (isShowingSequence || sequence.length === 0) return;
    sound.cheer("Let's watch again!");
    playSequence(sequence);
  };

  // Handle player clicking a gem button
  const handleGemClick = async (gemIndex: number) => {
    if (isShowingSequence || isSafeUnlocked || sequence.length === 0) return;

    await flashGem(gemIndex, 250);

    // Check if correct
    if (sequence[playerStep] === gemIndex) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);
      sound.playCoin();

      // Successfully finished sequence for this safe!
      if (nextStep === sequence.length) {
        setIsSafeUnlocked(true);
        sound.playVictory();
        sound.cheer("Safe cracked! Outstanding!");

        const reward = level * 100 + 50;
        const pts = level * 300;

        setDiamondsWon((prev) => prev + reward);
        setRoundScore((prev) => prev + pts);
        onEarnDiamonds(reward);
        onSafeCracked();

        setRichieMessage(`Hurray! Safe #${level} cracked! You found +${reward} Diamonds!`);

        // Automatically load next exciting level after 2 seconds
        setTimeout(() => {
          setLevel((prevLvl) => {
            const nextLvl = prevLvl + 1;
            startLevel(nextLvl);
            return nextLvl;
          });
        }, 2200);
      }
    } else {
      // Gentle friendly mistake handling for young kids
      sound.playSafeTone(0);
      setRichieMessage("That was close! Watch Richie replay the lights!");
      setTimeout(() => {
        playSequence(sequence);
      }, 700);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Top HUD */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Safe level & stats */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Vault Level
            </span>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-950">
              Safe #{level}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Total Safes Cracked
            </span>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-700 flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              {safesCracked}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Diamonds Earned
            </span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-600">
              <Sparkles className="w-5 h-5 fill-amber-500" />
              +{diamondsWon}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasStarted && (
            <button
              onClick={handleReplayHint}
              disabled={isShowingSequence}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 border border-stone-300 transition-colors cursor-pointer disabled:opacity-50 font-['Outfit']"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Replay Lights
            </button>
          )}

          {!hasStarted ? (
            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Outfit']"
            >
              Start Cracking!
            </button>
          ) : (
            <button
              onClick={handleStartGame}
              title="Restart Safe"
              aria-label="Restart safe memory game"
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mascot Box */}
      <RichieMascotBox message={richieMessage} />

      {/* Safe Door & Gem Buttons Area */}
      <div className="relative mx-auto w-full max-w-xl bg-gradient-to-b from-stone-800 via-stone-900 to-black p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center">
        {/* Golden Vault Dial Header */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-4 border-yellow-100 shadow-xl mb-6">
          <div className="w-20 h-20 rounded-full bg-stone-900 border-2 border-amber-400 flex items-center justify-center">
            {isSafeUnlocked ? (
              <Unlock className="w-10 h-10 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-10 h-10 text-amber-400" />
            )}
          </div>
          {isSafeUnlocked && (
            <div className="absolute -top-3 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-white shadow-md animate-pulse">
              OPEN!
            </div>
          )}
        </div>

        {/* Turn Status Message */}
        <div className="mb-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-wide font-['Fredoka'] uppercase bg-stone-800 border border-amber-400/50 text-amber-300">
            {isShowingSequence
              ? '👀 WATCH THE FLASHING GEMS...'
              : hasStarted
              ? '👉 TAP THE GEMS IN ORDER!'
              : 'PRESS START TO BEGIN!'}
          </span>
        </div>

        {/* 4 Large Gem Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm">
          {SAFE_GEMS.map((gem, idx) => {
            const isActive = activeGemIndex === idx;
            return (
              <button
                key={gem.name}
                onClick={() => handleGemClick(idx)}
                disabled={isShowingSequence || !hasStarted}
                className={`relative aspect-square rounded-3xl p-3 flex flex-col items-center justify-center gap-2 border-3 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? `scale-105 ${gem.glowClass} ring-6 border-white shadow-2xl`
                    : 'bg-stone-800/90 hover:bg-stone-750 border-stone-600 hover:border-amber-400 shadow-md active:scale-95'
                }`}
                aria-label={`Gem button ${gem.name}`}
              >
                <GemIcon type={gem.type} size={54} animate={isActive} />
                <span className="font-extrabold text-sm text-stone-200 tracking-wide font-['Fredoka']">
                  {gem.name}
                </span>

                {isActive && (
                  <div className="absolute inset-0 rounded-3xl bg-white/20 pointer-events-none animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sequence Progress Dots */}
        {hasStarted && (
          <div className="flex items-center gap-2 mt-6">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  i < playerStep
                    ? 'bg-emerald-400 border-white scale-110 shadow-xs'
                    : 'bg-stone-700 border-stone-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guide for kids */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl p-3 sm:p-4 text-center shadow-xs">
        <p className="text-xs sm:text-sm font-bold text-amber-950">
          🔐 <span className="underline decoration-amber-400">Memory Fun:</span> Repeat the musical pattern of gems! Every safe you open gives you more diamonds to spend on cool toys in Richie's Mansion!
        </p>
      </div>
    </div>
  );
};
