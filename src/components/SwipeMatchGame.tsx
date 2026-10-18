import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Trophy, RotateCcw, Zap, Volume2 } from 'lucide-react';
import { GemIcon } from './GemIcon';
import { GemType } from '../types/game';
import { sound } from '../utils/audio';
import { RichieMascotBox } from './RichieMascotBox';
import confetti from 'canvas-confetti';

interface SwipeMatchGameProps {
  onEarnDiamonds: (count: number) => void;
  onGoToShop: () => void;
}

const BOARD_SIZE = 6;
const GEMS: GemType[] = ['diamond', 'ruby', 'emerald', 'topaz', 'amethyst'];

const createBoard = (): GemType[][] => {
  let b: GemType[][] = [];
  let hasMatches = true;

  while (hasMatches) {
    b = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: GemType[] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        row.push(GEMS[Math.floor(Math.random() * GEMS.length)]);
      }
      b.push(row);
    }
    // Check if initial board has 3-in-a-row matches
    hasMatches = checkBoardMatches(b).length > 0;
  }
  return b;
};

// Check for horizontal and vertical 3+ matches
function checkBoardMatches(b: GemType[][]): { r: number; c: number }[] {
  const matched = new Set<string>();

  // Horizontal
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const t = b[r][c];
      if (t && t === b[r][c + 1] && t === b[r][c + 2]) {
        matched.add(`${r},${c}`);
        matched.add(`${r},${c + 1}`);
        matched.add(`${r},${c + 2}`);
      }
    }
  }

  // Vertical
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const t = b[r][c];
      if (t && t === b[r + 1][c] && t === b[r + 2][c]) {
        matched.add(`${r},${c}`);
        matched.add(`${r + 1},${c}`);
        matched.add(`${r + 2},${c}`);
      }
    }
  }

  return Array.from(matched).map((coord) => {
    const [r, c] = coord.split(',').map(Number);
    return { r, c };
  });
}

export const SwipeMatchGame: React.FC<SwipeMatchGameProps> = ({ onEarnDiamonds, onGoToShop }) => {
  const [board, setBoard] = useState<GemType[][]>(createBoard);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(1500);
  const [movesLeft, setMovesLeft] = useState(25);
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [richieMessage, setRichieMessage] = useState(
    "SWIPE to match 3 or more sparkling gems! Feel the haptic vibrations!"
  );

  // Touch tracking for swipe gestures
  const touchStartRef = useRef<{ x: number; y: number; r: number; c: number } | null>(null);

  // Trigger haptic vibration on match
  const triggerHaptic = (pattern: number | number[] = 40) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (isSwapping || movesLeft <= 0 || isVictory) return;
    touchStartRef.current = { x: e.clientX, y: e.clientY, r, c };
    setSelectedCell({ r, c });
    sound.playCatch();
  };

  const handlePointerUp = () => {
    touchStartRef.current = null;
    setSelectedCell(null);
  };

  // Perform swap and resolve cascades
  const executeSwap = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      if (r2 < 0 || r2 >= BOARD_SIZE || c2 < 0 || c2 >= BOARD_SIZE) return;
      setIsSwapping(true);

      const newBoard = board.map((row) => [...row]);
      const temp = newBoard[r1][c1];
      newBoard[r1][c1] = newBoard[r2][c2];
      newBoard[r2][c2] = temp;

      const matches = checkBoardMatches(newBoard);

      if (matches.length === 0) {
        // No match: bounce back with sound
        setBoard(newBoard);
        sound.playSafeTone(0);
        await new Promise((res) => setTimeout(res, 200));
        // Swap back
        const reverted = newBoard.map((row) => [...row]);
        reverted[r1][c1] = temp;
        reverted[r2][c2] = newBoard[r1][c1];
        setBoard(reverted);
        setIsSwapping(false);
        return;
      }

      // Valid Match!
      triggerHaptic([40, 30, 60]);
      sound.playCatch();
      sound.playCoin();
      sound.playGemPop(1);

      setMovesLeft((prev) => Math.max(0, prev - 1));

      // Resolve matches and cascade gems
      let currentBoard = newBoard;
      let totalMatchCount = 0;
      let cascadeLoop = true;
      let cascadeLevel = 1;

      while (cascadeLoop) {
        const found = checkBoardMatches(currentBoard);
        if (found.length === 0) {
          cascadeLoop = false;
          break;
        }

        totalMatchCount += found.length;
        triggerHaptic(50);
        sound.playCoin();
        sound.playGemPop(cascadeLevel);

        // Remove matched gems (set to null temporarily)
        const matchSet = new Set(found.map((m) => `${m.r},${m.c}`));
        const working = currentBoard.map((row, r) =>
          row.map((gem, c) => (matchSet.has(`${r},${c}`) ? (null as unknown as GemType) : gem))
        );

        // Gravity: drop gems down
        for (let c = 0; c < BOARD_SIZE; c++) {
          const colGems: GemType[] = [];
          for (let r = BOARD_SIZE - 1; r >= 0; r--) {
            if (working[r][c]) {
              colGems.unshift(working[r][c]);
            }
          }
          // Fill top with random fresh gems
          while (colGems.length < BOARD_SIZE) {
            colGems.unshift(GEMS[Math.floor(Math.random() * GEMS.length)]);
          }
          for (let r = 0; r < BOARD_SIZE; r++) {
            working[r][c] = colGems[r];
          }
        }

        currentBoard = working;
        setBoard(currentBoard);
        cascadeLevel++;
        await new Promise((res) => setTimeout(res, 220));
      }

      // Update score and diamonds
      const pointsWon = totalMatchCount * 50 * Math.max(1, cascadeLevel - 1);
      const diamondsWon = Math.max(1, Math.floor(totalMatchCount * 1.5));
      onEarnDiamonds(diamondsWon);

      setScore((prev) => {
        const next = prev + pointsWon;
        if (next >= targetScore && !isVictory) {
          setIsVictory(true);
          sound.playVictory();
          sound.cheer("Candy Match Master! Billionaire Level Complete!");
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          } catch {}
          setRichieMessage("INCREDIBLE SWIPE COMBO! You crushed the diamond vault target!");
        }
        return next;
      });

      setIsSwapping(false);
    },
    [board, isVictory, movesLeft, onEarnDiamonds, targetScore]
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStartRef.current || isSwapping) return;

    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;
    const threshold = 26; // swipe distance in pixels

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      const { r, c } = touchStartRef.current;
      touchStartRef.current = null; // Consume swipe gesture

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) executeSwap(r, c, r, c + 1); // Right
        else executeSwap(r, c, r, c - 1); // Left
      } else {
        // Vertical swipe
        if (dy > 0) executeSwap(r, c, r + 1, c); // Down
        else executeSwap(r, c, r - 1, c); // Up
      }
    }
  };

  const restartGame = () => {
    setBoard(createBoard());
    setScore(0);
    setMovesLeft(25);
    setIsVictory(false);
    setIsSwapping(false);
    sound.playCatch();
  };

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col gap-3 px-2 py-1 select-none">
      {/* Top Mobile Score Header */}
      <div className="bg-white rounded-3xl p-3.5 border-3 border-amber-400 shadow-md flex items-center justify-between gap-3">
        {/* Moves Left */}
        <div className="text-center">
          <span className="block text-[10px] font-black uppercase tracking-wider text-stone-500">
            Moves
          </span>
          <span className="font-mono tabular-nums text-2xl font-black text-amber-950">
            {movesLeft}
          </span>
        </div>

        {/* Score & Progress */}
        <div className="flex-1 text-center px-2">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 mb-1">
            <span>Score: {score}</span>
            <span className="text-amber-700">Target: {targetScore}</span>
          </div>
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300 shadow-xs"
              style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
            />
          </div>
        </div>

        {/* Restart */}
        <button
          onClick={restartGame}
          className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
          title="Restart Board"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Mascot Tip */}
      <RichieMascotBox message={richieMessage} />

      {/* Mobile Portrait 9:16 Jewel Board (Candy Crush Style) */}
      <div
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative aspect-square w-full bg-[#FFFBEB] p-2.5 sm:p-3.5 rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden touch-none"
      >
        <div className="grid grid-cols-6 gap-1.5 h-full w-full">
          {board.map((row, r) =>
            row.map((gem, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              return (
                <div
                  key={`${r}-${c}`}
                  onPointerDown={(e) => handlePointerDown(r, c, e)}
                  className={`relative rounded-2xl flex items-center justify-center p-1 cursor-grab active:cursor-grabbing transition-transform duration-100 active:scale-95 ${
                    isSelected
                      ? 'bg-amber-200 ring-4 ring-amber-500 scale-105 z-10'
                      : 'bg-white hover:bg-amber-50 border-2 border-amber-200 shadow-xs'
                  }`}
                >
                  <GemIcon type={gem} size={44} animate={isSelected} />
                </div>
              );
            })
          )}
        </div>

        {/* Victory Celebration Overlay */}
        {isVictory && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 animate-in fade-in">
            <div className="w-full max-w-xs bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-5 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-2 text-4xl animate-bounce">
                👑
              </div>
              <h3 className="text-2xl font-black font-['Fredoka'] text-amber-950 mb-1">
                Target Reached!
              </h3>
              <p className="text-xs font-bold text-stone-700 mb-4">
                You scored {score} points and crushed the vault!
              </p>
              <button
                onClick={restartGame}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-sm shadow-md transition-all cursor-pointer font-['Outfit']"
              >
                Play Next Level!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Guide Footnote */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl p-2.5 text-center shadow-xs">
        <p className="text-xs font-bold text-amber-950">
          👆 <span className="underline decoration-amber-400">Mobile Controls:</span> Touch and swipe gems Up, Down, Left, or Right to swap! Haptics vibrate on match!
        </p>
      </div>
    </div>
  );
};
