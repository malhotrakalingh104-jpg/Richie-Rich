import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, Heart, Shield, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { GemIcon } from './GemIcon';
import { sound } from '../utils/audio';
import { CelebrationModal } from './CelebrationModal';
import { RichieMascotBox } from './RichieMascotBox';

interface VaultCatcherGameProps {
  onEarnDiamonds: (count: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
  onGoToShop: () => void;
}

interface FallingItem {
  id: string;
  x: number; // percentage 0 - 100
  y: number; // pixels from top
  speed: number;
  type: 'diamond' | 'ruby' | 'emerald' | 'gold_bag' | 'magnet' | 'star_diamond' | 'mud';
  size: number;
}

export const VaultCatcherGame: React.FC<VaultCatcherGameProps> = ({
  onEarnDiamonds,
  highScore,
  onUpdateHighScore,
  onGoToShop
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cartX, setCartX] = useState<number>(50); // percentage 10% - 90%
  const [score, setScore] = useState<number>(0);
  const [diamondsWon, setDiamondsWon] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [magnetActive, setMagnetActive] = useState<boolean>(false);
  const [magnetTimer, setMagnetTimer] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [richieMessage, setRichieMessage] = useState<string>(
    "Move my golden treasure cart to catch the diamonds! Watch out for sticky mud!"
  );

  const itemsRef = useRef<FallingItem[]>([]);
  const [renderTrigger, setRenderTrigger] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number>(0);

  // Start new game
  const startGame = useCallback(() => {
    setScore(0);
    setDiamondsWon(0);
    setLives(3);
    setCartX(50);
    setMagnetActive(false);
    setMagnetTimer(0);
    setIsGameOver(false);
    setIsPlaying(true);
    itemsRef.current = [];
    setRichieMessage("Catch as many sparkling jewels as you can in my gold cart!");
    sound.playCatch();
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCartX((prev) => Math.max(10, prev - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCartX((prev) => Math.min(90, prev + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Handle mouse / touch position directly inside container
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying || isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(10, Math.min(90, relativeX));
    setCartX(clamped);
  };

  // Main animation frame game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    let lastTimestamp = performance.now();

    const loop = (currentTimestamp: number) => {
      const dt = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = currentTimestamp;

      // Spawn falling jewels
      spawnTimerRef.current += dt;
      if (spawnTimerRef.current >= 0.65) {
        spawnTimerRef.current = 0;
        const rand = Math.random();
        let itemType: FallingItem['type'] = 'diamond';

        if (rand < 0.35) itemType = 'diamond';
        else if (rand < 0.55) itemType = 'ruby';
        else if (rand < 0.75) itemType = 'emerald';
        else if (rand < 0.85) itemType = 'gold_bag';
        else if (rand < 0.92) itemType = 'star_diamond';
        else if (rand < 0.96) itemType = 'magnet';
        else itemType = 'mud';

        const newItem: FallingItem = {
          id: Math.random().toString(36).substring(2, 9),
          x: 10 + Math.random() * 80,
          y: -40,
          speed: 160 + Math.random() * 110,
          type: itemType,
          size: itemType === 'star_diamond' || itemType === 'gold_bag' ? 44 : 36
        };
        itemsRef.current.push(newItem);
      }

      // Update positions
      const containerHeight = containerRef.current?.clientHeight || 420;
      const cartY = containerHeight - 65; // cart position from top
      const nextItems: FallingItem[] = [];

      for (const item of itemsRef.current) {
        let newX = item.x;
        // If magnet is active, pull positive gems towards cartX
        if (magnetActive && item.type !== 'mud') {
          const diff = cartX - item.x;
          newX += diff * dt * 3.5;
        }

        const newY = item.y + item.speed * dt;

        // Collision detection with cart
        // Cart width is roughly ~22% of container
        const hitX = Math.abs(newX - cartX) < 11;
        const hitY = newY >= cartY - 20 && newY <= cartY + 35;

        if (hitX && hitY) {
          // Item caught!
          if (item.type === 'mud') {
            sound.playSafeTone(0);
            setLives((prev) => {
              const updated = prev - 1;
              if (updated <= 0) {
                setIsGameOver(true);
                setIsPlaying(false);
              }
              return Math.max(0, updated);
            });
            setRichieMessage("Oops! Watch out for muddy shoes in the clean vault!");
          } else if (item.type === 'magnet') {
            sound.playRainbowExplosion();
            sound.cheer("Diamond Magnet Power!");
            setMagnetActive(true);
            setMagnetTimer(6);
            setRichieMessage("MAGNET ON! All diamonds are zooming to your cart!");
          } else {
            // Jewel or treasure caught
            sound.playCatch();
            sound.playCoin();
            let pts = 50;
            let gemCount = 2;

            if (item.type === 'ruby') {
              pts = 40;
              gemCount = 1;
            } else if (item.type === 'emerald') {
              pts = 35;
              gemCount = 1;
            } else if (item.type === 'gold_bag') {
              pts = 150;
              gemCount = 5;
              sound.playCoin();
            } else if (item.type === 'star_diamond') {
              pts = 300;
              gemCount = 10;
              sound.playRainbowExplosion();
            }

            setScore((prev) => {
              const next = prev + pts;
              if (next > highScore) onUpdateHighScore(next);
              return next;
            });
            setDiamondsWon((prev) => prev + gemCount);
            onEarnDiamonds(gemCount);
          }
          continue; // Don't keep caught item
        }

        // Keep item if it hasn't fallen off bottom
        if (newY < containerHeight + 20) {
          nextItems.push({ ...item, x: newX, y: newY });
        }
      }

      itemsRef.current = nextItems;
      setRenderTrigger((t) => t + 1);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isGameOver, cartX, magnetActive, highScore, onEarnDiamonds, onUpdateHighScore]);

  // Magnet countdown timer
  useEffect(() => {
    if (magnetActive && magnetTimer > 0) {
      const timer = setTimeout(() => {
        setMagnetTimer((t) => {
          if (t <= 1) {
            setMagnetActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [magnetActive, magnetTimer]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Top HUD */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Scores & Lives */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Vault Score
            </span>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-950">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Diamonds Caught
            </span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-600">
              <Sparkles className="w-5 h-5 fill-amber-500" />
              +{diamondsWon}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          {/* Hearts / Lives */}
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Hearts
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-6 h-6 transition-all ${
                    heart <= lives
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-stone-300 fill-stone-200 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls & Magnet Indicator */}
        <div className="flex items-center gap-3">
          {magnetActive && (
            <div className="flex items-center gap-1.5 bg-purple-100 text-purple-900 border-2 border-purple-400 px-3 py-1.5 rounded-2xl font-black text-xs animate-bounce font-['Outfit'] shadow-sm">
              🧲 MAGNET ON ({magnetTimer}s)
            </div>
          )}

          {!isPlaying && !isGameOver ? (
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Outfit']"
            >
              Start Catching!
            </button>
          ) : (
            <button
              onClick={startGame}
              title="Restart"
              aria-label="Restart round"
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mascot Tip */}
      <RichieMascotBox message={richieMessage} />

      {/* Falling Arena Container with Richie's Indoor Mansion Play Palace */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative mx-auto w-full max-w-2xl h-[420px] rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden cursor-ew-resize select-none touch-none"
        style={{
          backgroundImage: `url('/src/assets/images/richie_indoor_mansion_1792220699979.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Start Game prompt overlay - 100% Solid Card */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80">
            <div className="w-full max-w-sm bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-amber-400 rounded-2xl p-2 shadow-md flex items-center justify-center animate-bounce border-2 border-white">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-amber-950 mb-1">
                Richie's Diamond Catcher
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mb-5">
                Move the Golden Treasure Cart across the mansion living room to catch falling diamonds & treasures!
              </p>
              <button
                onClick={startGame}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer font-['Outfit']"
              >
                Tap to Start Playing! 💎
              </button>
            </div>
          </div>
        )}

        {/* Falling items */}
        {isPlaying &&
          itemsRef.current.map((item) => {
            return (
              <div
                key={item.id}
                className="absolute pointer-events-none transition-transform will-change-transform"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {item.type === 'diamond' && <GemIcon type="diamond" size={item.size} />}
                {item.type === 'ruby' && <GemIcon type="ruby" size={item.size} />}
                {item.type === 'emerald' && <GemIcon type="emerald" size={item.size} />}
                {item.type === 'star_diamond' && <GemIcon type="rainbow" size={item.size} animate />}
                {item.type === 'gold_bag' && (
                  <div className="w-10 h-10 bg-amber-400 text-amber-950 rounded-2xl border-2 border-yellow-200 shadow-lg flex items-center justify-center font-black text-xl animate-pulse">
                    💰
                  </div>
                )}
                {item.type === 'magnet' && (
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-2xl border-2 border-purple-200 shadow-lg flex items-center justify-center font-black text-xl animate-bounce">
                    🧲
                  </div>
                )}
                {item.type === 'mud' && (
                  <div className="w-9 h-9 bg-stone-700 text-stone-300 rounded-full border-2 border-stone-500 shadow-md flex items-center justify-center font-black text-lg">
                    💩
                  </div>
                )}
              </div>
            );
          })}

        {/* Richie's Golden Treasure Cart Player */}
        <div
          className="absolute bottom-3 will-change-transform transition-all duration-75 pointer-events-none"
          style={{
            left: `${cartX}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Magnet aura glow if active */}
            {magnetActive && (
              <div className="absolute -inset-4 rounded-3xl bg-purple-400/30 border-2 border-purple-300 animate-ping" />
            )}

            {/* Treasure Chest Cart Artwork */}
            <div className="w-24 sm:w-28 h-14 bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-2xl border-3 border-yellow-100 shadow-2xl flex items-center justify-center px-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl">💎</span>
                <span className="text-xs font-black font-['Fredoka'] text-amber-950 uppercase tracking-tight">
                  Richie Cart
                </span>
                <span className="text-xl">💰</span>
              </div>
            </div>

            {/* Golden wheels */}
            <div className="flex justify-between w-20 sm:w-24 -mt-2">
              <div className="w-5 h-5 rounded-full bg-amber-700 border-2 border-yellow-300 shadow-xs" />
              <div className="w-5 h-5 rounded-full bg-amber-700 border-2 border-yellow-300 shadow-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* On-screen Left & Right buttons for small kids on tablets / mobile */}
      <div className="flex items-center justify-center gap-6 py-1">
        <button
          onClick={() => setCartX((prev) => Math.max(10, prev - 12))}
          className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md border-2 border-amber-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          aria-label="Move Cart Left"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <span className="text-xs font-bold text-stone-500 text-center">
          Tap Arrows or Drag to Steer
        </span>

        <button
          onClick={() => setCartX((prev) => Math.min(90, prev + 12))}
          className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md border-2 border-amber-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          aria-label="Move Cart Right"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Celebration Modal when lives run out */}
      <CelebrationModal
        isOpen={isGameOver}
        title="Vault Cart Filled!"
        subtitle="You caught a spectacular heap of gemstones!"
        score={score}
        gemsEarned={diamondsWon}
        onPlayAgain={startGame}
        onGoToShop={onGoToShop}
      />
    </div>
  );
};
