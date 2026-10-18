import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, Heart, ArrowLeft, ArrowRight, RotateCcw, Volume2, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';
import { RichieMascotBox } from './RichieMascotBox';
import confetti from 'canvas-confetti';

interface SixLevelsGameProps {
  onEarnDiamonds: (count: number) => void;
  onGoToShop: () => void;
}

interface Item {
  id: string;
  x: number;
  y: number;
  type: 'gem' | 'star' | 'mud';
  speed: number;
  rot: number;
}

const LEVELS = [
  { id: 1, name: "1. Bedroom Safe", target: 12, speed: 2.2, spawnRate: 0.85, color: "#FEF3C7" },
  { id: 2, name: "2. Mansion Play Palace", target: 16, speed: 2.8, spawnRate: 0.72, color: "#FDE68A" },
  { id: 3, name: "3. Golden Grand Staircase", target: 20, speed: 3.3, spawnRate: 0.65, color: "#FCD34D" },
  { id: 4, name: "4. Secret Laser Vault", target: 24, speed: 3.9, spawnRate: 0.58, color: "#FBBF24" },
  { id: 5, name: "5. Diamond Cavern", target: 28, speed: 4.5, spawnRate: 0.52, color: "#F59E0B" },
  { id: 6, name: "6. Master Treasury", target: 35, speed: 5.2, spawnRate: 0.45, color: "#D97706" }
];

export const SixLevelsGame: React.FC<SixLevelsGameProps> = ({ onEarnDiamonds, onGoToShop }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [cartX, setCartX] = useState(50); // percentage 10% - 90%
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLevelWon, setIsLevelWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [richieMessage, setRichieMessage] = useState(
    "Welcome to the 6 Mansion Levels! Catch the required diamonds in each room to beat the game!"
  );

  const itemsRef = useRef<Item[]>([]);
  const [, setTick] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const spawnTimerRef = useRef(0);

  const currentLevel = LEVELS[levelIndex];

  // Start / restart current level
  const startLevel = useCallback((lvlIdx: number) => {
    setLevelIndex(lvlIdx);
    setScore(0);
    setLives(3);
    setCartX(50);
    setIsLevelWon(false);
    setIsGameOver(false);
    setIsPlaying(true);
    itemsRef.current = [];
    spawnTimerRef.current = 0;
    setRichieMessage(`Room ${LEVELS[lvlIdx].name}: Collect ${LEVELS[lvlIdx].target} diamonds to open the vault door!`);
    sound.playCatch();
  }, []);

  // Controls: keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isLevelWon || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCartX((prev) => Math.max(10, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCartX((prev) => Math.min(90, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isLevelWon, isGameOver]);

  // Pointer drag controls
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying || isLevelWon || isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setCartX(Math.max(10, Math.min(90, relativeX)));
  };

  // Main game animation loop
  useEffect(() => {
    if (!isPlaying || isLevelWon || isGameOver) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Spawn items
      spawnTimerRef.current += dt;
      if (spawnTimerRef.current >= currentLevel.spawnRate) {
        spawnTimerRef.current = 0;
        const isBad = Math.random() < 0.28;
        const newItem: Item = {
          id: Math.random().toString(36).substring(2, 9),
          x: 10 + Math.random() * 80,
          y: -30,
          speed: (currentLevel.speed * 60) + Math.random() * 50,
          type: isBad ? 'mud' : (Math.random() < 0.22 ? 'star' : 'gem'),
          rot: Math.random() * Math.PI * 2
        };
        itemsRef.current.push(newItem);
      }

      // Update item positions & detect collision
      const containerHeight = containerRef.current?.clientHeight || 400;
      const cartY = containerHeight - 60;
      const nextItems: Item[] = [];

      for (const item of itemsRef.current) {
        const newY = item.y + item.speed * dt;
        const hitX = Math.abs(item.x - cartX) < 12;
        const hitY = newY >= cartY - 20 && newY <= cartY + 30;

        if (hitX && hitY) {
          if (item.type === 'mud') {
            sound.playSafeTone(0);
            setLives((prev) => {
              const updated = prev - 1;
              if (updated <= 0) {
                setIsGameOver(true);
                setIsPlaying(false);
                sound.playSafeTone(0);
                setRichieMessage("Oh no, muddy shoes! Tap Restart to try this room again!");
              }
              return Math.max(0, updated);
            });
          } else {
            sound.playCatch();
            sound.playCoin();
            const pts = item.type === 'star' ? 2 : 1;
            onEarnDiamonds(pts);
            setScore((prev) => {
              const next = prev + pts;
              if (next >= currentLevel.target) {
                setIsLevelWon(true);
                setIsPlaying(false);
                sound.playVictory();
                try {
                  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                } catch {}
                if (levelIndex >= LEVELS.length - 1) {
                  sound.cheer("You completed all 6 levels! You are a billionaire champion!");
                  setRichieMessage("UNBELIEVABLE! You cleared all 6 rooms and unlocked the Master Treasury!");
                } else {
                  sound.cheer("Level cleared! Fantastic job!");
                  setRichieMessage(`Awesome! Room ${currentLevel.name} complete! Ready for the next room?`);
                }
              }
              return next;
            });
          }
          continue;
        }

        if (newY < containerHeight + 30) {
          nextItems.push({ ...item, y: newY, rot: item.rot + 0.03 });
        }
      }

      itemsRef.current = nextItems;
      setTick((t) => t + 1);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isLevelWon, isGameOver, cartX, currentLevel, levelIndex, onEarnDiamonds]);

  const handleNextLevel = () => {
    if (levelIndex >= LEVELS.length - 1) {
      startLevel(0);
    } else {
      startLevel(levelIndex + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Top HUD */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <div>
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
              Current Room
            </span>
            <div className="font-extrabold text-lg sm:text-xl text-amber-950 font-['Fredoka']">
              {currentLevel.name}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
              Level Target
            </span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-2xl font-black text-amber-600">
              <Sparkles className="w-5 h-5 fill-amber-500" />
              {score} / {currentLevel.target} 💎
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-black text-stone-500 uppercase tracking-wide">
              Lives
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-6 h-6 transition-all ${
                    h <= lives
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-stone-300 fill-stone-200 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div>
          {!isPlaying && !isLevelWon && !isGameOver ? (
            <button
              onClick={() => startLevel(0)}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Outfit']"
            >
              Start 6 Levels!
            </button>
          ) : (
            <button
              onClick={() => startLevel(levelIndex)}
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Restart Level"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mascot Tip */}
      <RichieMascotBox message={richieMessage} />

      {/* Game Playing Canvas / Area with Richie's indoor mansion */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative mx-auto w-full max-w-2xl h-[400px] rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden cursor-ew-resize select-none touch-none bg-cover bg-center"
        style={{
          backgroundImage: `url('/src/assets/images/richie_indoor_mansion_1792220699979.jpg')`
        }}
      >
        {/* Soft tone filter to differentiate levels */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: currentLevel.color, opacity: 0.18 }}
        />

        {/* Start Screen Overlay */}
        {!isPlaying && !isLevelWon && !isGameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80">
            <div className="w-full max-w-sm bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-amber-400 rounded-2xl p-2 shadow-md flex items-center justify-center animate-bounce border-2 border-white">
                <span className="text-3xl">🏰</span>
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-amber-950 mb-1">
                6 Mansion Levels
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mb-5">
                Play through all 6 rooms of Richie's mansion! Catch diamonds and avoid mud puddles!
              </p>
              <button
                onClick={() => startLevel(0)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer font-['Outfit']"
              >
                Start Room 1! 💎
              </button>
            </div>
          </div>
        )}

        {/* Level Won Overlay */}
        {isLevelWon && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in">
            <div className="w-full max-w-sm bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-2 text-4xl animate-bounce">
                🏆
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-amber-950 mb-1">
                {levelIndex >= LEVELS.length - 1 ? 'Mansion Conquered!' : 'Room Complete!'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mb-4">
                {levelIndex >= LEVELS.length - 1
                  ? "You unlocked every vault room in Richie's mansion!"
                  : `Target of ${currentLevel.target} diamonds reached!`}
              </p>
              <button
                onClick={handleNextLevel}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer font-['Outfit']"
              >
                {levelIndex >= LEVELS.length - 1 ? 'Play From Room 1 ➔' : 'Next Room ➔'}
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in">
            <div className="w-full max-w-sm bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-2 text-4xl">
                💫
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-amber-950 mb-1">
                Mud Splatter!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mb-4">
                Watch out for the mud puddles! Tap below to replay this room.
              </p>
              <button
                onClick={() => startLevel(levelIndex)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer font-['Outfit']"
              >
                Replay Room {levelIndex + 1}
              </button>
            </div>
          </div>
        )}

        {/* Falling items in room */}
        {isPlaying &&
          itemsRef.current.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none transition-transform will-change-transform"
              style={{
                left: `${item.x}%`,
                top: `${item.y}px`,
                transform: `translate(-50%, -50%) rotate(${item.rot}rad)`
              }}
            >
              {item.type === 'gem' && <span className="text-3xl drop-shadow-md">💎</span>}
              {item.type === 'star' && <span className="text-4xl drop-shadow-lg animate-pulse">⭐</span>}
              {item.type === 'mud' && <span className="text-3xl drop-shadow-md">💩</span>}
            </div>
          ))}

        {/* Player Cart */}
        <div
          className="absolute bottom-3 will-change-transform transition-all duration-75 pointer-events-none"
          style={{
            left: `${cartX}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-24 sm:w-28 h-12 bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-2xl border-3 border-yellow-100 shadow-2xl flex items-center justify-center px-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl">💎</span>
                <span className="text-xs font-black font-['Fredoka'] text-amber-950 uppercase tracking-tight">
                  Cart
                </span>
                <span className="text-xl">🏎️</span>
              </div>
            </div>
            <div className="flex justify-between w-20 -mt-1.5">
              <div className="w-4 h-4 rounded-full bg-amber-800 border-2 border-yellow-300 shadow-xs" />
              <div className="w-4 h-4 rounded-full bg-amber-800 border-2 border-yellow-300 shadow-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* On-screen control buttons */}
      <div className="flex items-center justify-center gap-6 py-1">
        <button
          onClick={() => setCartX((prev) => Math.max(10, prev - 12))}
          className="w-16 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md border-2 border-amber-300 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <span className="text-xs font-bold text-stone-600 text-center">
          Tap Arrows or Drag to Move
        </span>

        <button
          onClick={() => setCartX((prev) => Math.min(90, prev + 12))}
          className="w-16 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md border-2 border-amber-300 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
          aria-label="Move Right"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
