export type GemType = 'diamond' | 'ruby' | 'emerald' | 'topaz' | 'amethyst' | 'rainbow';

export interface GemInfo {
  type: GemType;
  name: string;
  color: string;
  glow: string;
  symbol: string;
  svgPath?: string;
  points: number;
}

export interface StoreItem {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
  category: 'vehicles' | 'friends' | 'luxuries' | 'treats';
  description: string;
  icon: string;
  rewardDiamondsPerSec?: number;
}

export type ActiveGameTab = 'swipe-match' | 'six-levels' | 'gem-blast' | 'vault-catcher' | 'safe-cracker' | 'mansion-vault';

export interface PlayerStats {
  diamonds: number;
  goldCoins: number;
  highScoreBlast: number;
  highScoreCatcher: number;
  safesCracked: number;
  unlockedItemIds: string[];
}
