import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Trophy, Zap, Clock, RotateCcw, Volume2 } from 'lucide-react';
import { GemType } from '../types/game';
import { GemIcon } from './GemIcon';
import { sound } from '../utils/audio';
import { CelebrationModal } from './CelebrationModal';
import { RichieMascotBox } from './RichieMascotBox';

interface GemBlastGameProps {
  onEarnDiamonds: (count: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
  onGoToShop: () => void;
}

interface Tile {
  id: string;
  type: GemType;
}

const GRID_SIZE = 7;
const BASE_GEMS: GemType[] = ['diamond', 'ruby', 'emerald', 'topaz', 'amethyst'];

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialGrid = (): Tile[][] => {
  const grid: Tile[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const randomType = BASE_GEMS[Math.floor(Math.random() * BASE_GEMS.length)];
      row.push({ id: generateId(), type: randomType });
    }
    grid.push(row);
  }
  return grid;
};

// Find all connected tiles of same type using flood fill
const findConnectedCluster = (grid: Tile[][], startR: number, startC: number): [number, number][] => {
  const targetType = grid[startR][startC].type;
  if (!targetType) return [];

  const visited = new Set<string>();
  const cluster: [number, number][] = [];
  const queue: [number, number][] = [[startR, startC]];
  visited.add(`${startR},${startC}`);

  // Rainbow gem behaves specially
  if (targetType === 'rainbow') {
    return [[startR, startC]];
  }

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    cluster.push([r, c]);

    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1]
    ];

    for (const [nr, nc] of neighbors) {
      if (
        nr >= 0 &&
        nr < GRID_SIZE &&
        nc >= 0 &&
        nc < GRID_SIZE &&
        !visited.has(`${nr},${nc}`) &&
        grid[nr][nc].type === targetType
      ) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc]);
      }
    }
  }

  return cluster;
};

export const GemBlastGame: React.FC<GemBlastGameProps> = ({
  onEarnDiamonds,
  highScore,
  onUpdateHighScore,
  onGoToShop
}) => {
  const [grid, setGrid] = useState<Tile[][]>(createInitialGrid);
  const [score, setScore] = useState<number>(0);
  const [sessionGems, setSessionGems] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(1);
  const [hoveredCluster, setHoveredCluster] = useState<Set<string>>(new Set());
  const [floatingTexts, setFloatingTexts] = useState<
    { id: string; text: string; x: number; y: number }[]
  >([]);
  const [isTimedMode, setIsTimedMode] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [richieMessage, setRichieMessage] = useState<string>(
    "Tap any 2 or more matching gems to pop them into gold! Match 5 for a Rainbow Mega-Diamond!"
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer loop for timed mode
  useEffect(() => {
    if (isTimedMode && timeLeft > 0 && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimedMode, timeLeft, isGameOver]);

  // Restart / Reset
  const handleRestart = useCallback(() => {
    setGrid(createInitialGrid());
    setScore(0);
    setSessionGems(0);
    setComboCount(1);
    setTimeLeft(60);
    setIsGameOver(false);
    setFloatingTexts([]);
    setRichieMessage("New round started! Pop big clusters for huge diamond rewards!");
    sound.playCatch();
  }, []);

  // Handle tile hovering to visually preview connected group for young kids
  const handleTileHover = (r: number, c: number) => {
    if (isGameOver) return;
    const cluster = findConnectedCluster(grid, r, c);
    if (cluster.length >= 2 || grid[r][c].type === 'rainbow') {
      const set = new Set(cluster.map(([cr, cc]) => `${cr},${cc}`));
      setHoveredCluster(set);
    } else {
      setHoveredCluster(new Set());
    }
  };

  const handleTileLeave = () => {
    setHoveredCluster(new Set());
  };

  // Pop cluster logic
  const handleTileClick = (r: number, c: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isGameOver) return;

    const clickedTile = grid[r][c];
    let tilesToPop: [number, number][] = [];
    let isRainbowExplosion = false;

    if (clickedTile.type === 'rainbow') {
      isRainbowExplosion = true;
      // Explode 3x3 radius around the rainbow gem
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            tilesToPop.push([nr, nc]);
          }
        }
      }
    } else {
      const cluster = findConnectedCluster(grid, r, c);
      if (cluster.length < 2) {
        sound.playSafeTone(0);
        return; // Needs at least 2 connected gems
      }
      tilesToPop = cluster;
    }

    // Sound effect & voice feedback
    if (isRainbowExplosion) {
      sound.playRainbowExplosion();
      sound.cheer("Rainbow Mega Diamond!");
      setRichieMessage("WOW! Super Rainbow Diamond Explosion!");
    } else {
      sound.playGemPop(comboCount);
      sound.playCoin();
      if (tilesToPop.length >= 6) {
        sound.cheer("Super Rich Combo!");
        setRichieMessage("Incredible combo! My vault is filling up fast!");
      }
    }

    // Points calculation: exponential reward for bigger clusters
    const basePoints = isRainbowExplosion ? 1000 : tilesToPop.length * 50 * comboCount;
    const diamondsEarned = Math.max(1, Math.floor(tilesToPop.length * (isRainbowExplosion ? 4 : 2)));

    setScore((prev) => {
      const next = prev + basePoints;
      if (next > highScore) onUpdateHighScore(next);
      return next;
    });

    setSessionGems((prev) => prev + diamondsEarned);
    onEarnDiamonds(diamondsEarned);
    setComboCount((prev) => Math.min(prev + 1, 8));

    // Floating score animation
    const rect = e.currentTarget.getBoundingClientRect();
    const floatId = generateId();
    setFloatingTexts((prev) => [
      ...prev,
      {
        id: floatId,
        text: `+${basePoints.toLocaleString()} 💎`,
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    ]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== floatId));
    }, 900);

    // Grid update with gravity:
    const newGrid = grid.map((row) => [...row]);
    const popSet = new Set(tilesToPop.map(([pr, pc]) => `${pr},${pc}`));

    // If cluster was big (>= 5) and not already a rainbow, leave a Rainbow Mega-Diamond at clicked spot!
    const createRainbow = !isRainbowExplosion && tilesToPop.length >= 5;

    // Remove popped tiles column by column and drop new ones
    for (let col = 0; col < GRID_SIZE; col++) {
      const remainingTiles: Tile[] = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (createRainbow && row === r && col === c) {
          remainingTiles.unshift({ id: generateId(), type: 'rainbow' });
        } else if (!popSet.has(`${row},${col}`)) {
          remainingTiles.unshift(newGrid[row][col]);
        }
      }
      // Fill top with fresh random gems
      while (remainingTiles.length < GRID_SIZE) {
        const randType = BASE_GEMS[Math.floor(Math.random() * BASE_GEMS.length)];
        remainingTiles.unshift({ id: generateId(), type: randType });
      }
      // Place back into newGrid
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = remainingTiles[row];
      }
    }

    setGrid(newGrid);
    setHoveredCluster(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Top Banner & Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-3 border-amber-400 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Game Stats */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Round Score
            </span>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-950">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Gems Won
            </span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-2xl sm:text-3xl font-black text-amber-600">
              <Sparkles className="w-5 h-5 fill-amber-500" />
              +{sessionGems}
            </div>
          </div>

          <div className="h-8 w-px bg-amber-200 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Best Score
            </span>
            <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-stone-700 flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Mode Selector & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => {
                setIsTimedMode(true);
                setTimeLeft(60);
                setIsGameOver(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-colors cursor-pointer font-['Outfit'] ${
                isTimedMode
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              60s Countdown
            </button>
            <button
              onClick={() => {
                setIsTimedMode(false);
                setIsGameOver(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-colors cursor-pointer font-['Outfit'] ${
                !isTimedMode
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Relaxed
            </button>
          </div>

          {/* Timer Display */}
          {isTimedMode ? (
            <div
              className={`px-3.5 py-1.5 rounded-2xl font-mono tabular-nums font-black text-lg border flex items-center gap-1 ${
                timeLeft <= 10
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
              title="60s Countdown Timer"
            >
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-2xl font-black text-xs border bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1 font-['Outfit']">
              <span>∞ No Timer</span>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleRestart}
            title="Reset Game with fresh 60s"
            aria-label="Restart game"
            className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mascot Tip Box */}
      <RichieMascotBox message={richieMessage} />

      {/* Main Game Playing Board - 100% Solid background */}
      <div className="relative mx-auto bg-[#FFFBEB] p-3 sm:p-5 rounded-3xl border-4 border-amber-400 shadow-2xl max-w-[500px] w-full">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 select-none">
          {grid.map((row, r) =>
            row.map((tile, c) => {
              const isHovered = hoveredCluster.has(`${r},${c}`);
              return (
                <button
                  key={tile.id}
                  onClick={(e) => handleTileClick(r, c, e)}
                  onMouseEnter={() => handleTileHover(r, c)}
                  onMouseLeave={handleTileLeave}
                  className={`relative aspect-square rounded-2xl p-1 flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 ${
                    isHovered
                      ? 'scale-108 bg-amber-100 shadow-lg ring-3 ring-amber-500 z-10 border-2 border-amber-400'
                      : 'bg-white hover:bg-amber-50 shadow-xs hover:scale-102 border-2 border-amber-200'
                  }`}
                  aria-label={`${tile.type} gem at row ${r + 1}, column ${c + 1}`}
                >
                  <GemIcon
                    type={tile.type}
                    size={42}
                    animate={isHovered || tile.type === 'rainbow'}
                  />

                  {/* Mega Rainbow star badge */}
                  {tile.type === 'rainbow' && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md uppercase border border-white">
                      MEGA
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Floating pop score notifications - solid pill */}
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className="fixed pointer-events-none text-amber-950 font-black font-['Fredoka'] text-xl sm:text-2xl drop-shadow-md animate-bounce z-50 bg-[#FBBF24] px-3.5 py-1.5 rounded-full border-2 border-white shadow-xl"
            style={{
              left: `${f.x}px`,
              top: `${f.y - 20}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* Instructions / How to play for kids under 10 */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl p-3 sm:p-4 text-center shadow-xs">
        <p className="text-xs sm:text-sm font-bold text-amber-950">
          🎮 <span className="underline decoration-amber-400">Kids Guide:</span> Click 2 or more connected matching gems to pop them! Match 5 gems at once to get a <span className="text-purple-600 font-extrabold">Rainbow Mega-Diamond</span> that clears a giant area!
        </p>
      </div>

      {/* Victory / Round Summary Modal */}
      <CelebrationModal
        isOpen={isGameOver}
        title="Diamond Rush Complete!"
        subtitle="You proved you've got the billionaire diamond eye!"
        score={score}
        gemsEarned={sessionGems}
        onPlayAgain={handleRestart}
        onGoToShop={onGoToShop}
      />
    </div>
  );
};
