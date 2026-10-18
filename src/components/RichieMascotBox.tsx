import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface RichieMascotBoxProps {
  message?: string;
  className?: string;
}

const RICHIE_QUOTES = [
  "Look at all those sparkling diamonds! Let's fill the royal vault!",
  "My butler Cadbury says you're playing like a true billionaire kid!",
  "Did you know? Even my roller coaster is made of 24k solid gold!",
  "Pop a cluster of 5 gems to make a Rainbow Mega-Diamond!",
  "My dog Dollar loves chasing shiny diamonds more than bones!",
  "Keep collecting! We can unlock the Solid Gold Go-Kart together!"
];

export const RichieMascotBox: React.FC<RichieMascotBoxProps> = ({
  message,
  className = ''
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const displayMessage = message || RICHIE_QUOTES[quoteIdx];

  const handleNextQuote = () => {
    const next = (quoteIdx + 1) % RICHIE_QUOTES.length;
    setQuoteIdx(next);
    sound.playCatch();
    sound.cheer(RICHIE_QUOTES[next]);
  };

  return (
    <div className={`flex items-center gap-3.5 bg-[#FFFDF0] border-3 border-amber-400 rounded-3xl p-3.5 shadow-md ${className}`}>
      {/* Richie Rich Mascot Avatar */}
      <div 
        onClick={handleNextQuote}
        className="relative shrink-0 cursor-pointer group"
        title="Tap Richie to hear him speak!"
      >
        <img
          src="/src/assets/images/richie_mascot_1792220316497.jpg"
          alt="Richie Rich boy billionaire mascot"
          referrerPolicy="no-referrer"
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-amber-400 shadow-md object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-xs">
          TAP!
        </div>
      </div>

      {/* Speech bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-extrabold text-sm text-amber-950 font-['Fredoka']">
            Richie Rich
          </span>
          <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.5 rounded-sm">
            Vault Master
          </span>
          <button
            onClick={() => sound.cheer(displayMessage)}
            className="text-amber-700 hover:text-amber-900 ml-auto cursor-pointer p-1"
            title="Speak this tip"
            aria-label="Speak tip"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug line-clamp-2">
          "{displayMessage}"
        </p>
      </div>
    </div>
  );
};
