import React from 'react';
import { GemType } from '../types/game';

interface GemIconProps {
  type: GemType;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const GemIcon: React.FC<GemIconProps> = ({
  type,
  size = 48,
  className = '',
  animate = false
}) => {
  const animClass = animate ? 'animate-bounce' : '';

  switch (type) {
    case 'diamond':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-md ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Classic Brilliant Cut Diamond */}
          <polygon points="50,12 85,38 72,88 28,88 15,38" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="3" />
          <polygon points="50,12 85,38 65,38 50,12" fill="#BAE6FD" />
          <polygon points="50,12 15,38 35,38 50,12" fill="#BAE6FD" />
          <polygon points="35,38 65,38 50,88 35,38" fill="#F0F9FF" />
          <polygon points="15,38 35,38 28,88" fill="#7DD3FC" />
          <polygon points="85,38 65,38 72,88" fill="#7DD3FC" />
          {/* Sparkle star */}
          <polygon points="40,26 43,32 49,35 43,38 40,44 37,38 31,35 37,32" fill="#FFFFFF" />
        </svg>
      );

    case 'ruby':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-md ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Heart / Oval Ruby */}
          <path
            d="M50 24 C40 10, 18 14, 18 36 C18 60, 48 84, 50 86 C52 84, 82 60, 82 36 C82 14, 60 10, 50 24 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="3"
          />
          <path
            d="M50 32 C43 20, 26 24, 26 40 C26 58, 48 76, 50 78 C52 76, 74 58, 74 40 C74 24, 57 20, 50 32 Z"
            fill="#F87171"
          />
          {/* Highlight Facet */}
          <circle cx="36" cy="36" r="6" fill="#FCA5A5" />
          <polygon points="62,32 64,36 68,38 64,40 62,44 60,40 56,38 60,36" fill="#FFFFFF" />
        </svg>
      );

    case 'emerald':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-md ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Octagonal Emerald Cut */}
          <polygon points="32,15 68,15 85,32 85,68 68,85 32,85 15,68 15,32" fill="#10B981" stroke="#047857" strokeWidth="3" />
          <polygon points="38,24 62,24 76,38 76,62 62,76 38,76 24,62 24,38" fill="#34D399" />
          <polygon points="44,32 56,32 66,42 66,58 56,68 44,68 34,58 34,42" fill="#6EE7B7" />
          <polygon points="58,28 60,32 64,34 60,36 58,40 56,36 52,34 56,32" fill="#FFFFFF" />
        </svg>
      );

    case 'topaz':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-md ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Golden Diamond / Rhombus Topaz */}
          <polygon points="50,14 86,50 50,86 14,50" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <polygon points="50,24 76,50 50,76 24,50" fill="#FBBF24" />
          <polygon points="50,34 66,50 50,66 34,50" fill="#FDE68A" />
          <polygon points="48,22 50,26 54,28 50,30 48,34 46,30 42,28 46,26" fill="#FFFFFF" />
        </svg>
      );

    case 'amethyst':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-md ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cushion / Hexagon Royal Amethyst */}
          <polygon points="50,14 85,32 85,68 50,86 15,68 15,32" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
          <polygon points="50,24 75,38 75,62 50,76 25,62 25,38" fill="#A78BFA" />
          <polygon points="50,34 65,42 65,58 50,66 35,58 35,42" fill="#C4B5FD" />
          <polygon points="40,24 42,28 46,30 42,32 40,36 38,32 34,30 38,28" fill="#FFFFFF" />
        </svg>
      );

    case 'rainbow':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`drop-shadow-lg ${animClass} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="25%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="75%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Star Prismatic Diamond */}
          <polygon
            points="50,10 62,35 90,38 68,58 75,85 50,70 25,85 32,58 10,38 38,35"
            fill="url(#rainbowGrad)"
            stroke="#FEF08A"
            strokeWidth="3"
          />
          <circle cx="50" cy="50" r="16" fill="#FFFFFF" fillOpacity="0.85" />
          <polygon points="50,38 53,46 61,50 53,54 50,62 47,54 39,50 47,46" fill="#F59E0B" />
        </svg>
      );

    default:
      return null;
  }
};
