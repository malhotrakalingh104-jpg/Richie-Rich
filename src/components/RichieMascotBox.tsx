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

return null;
}

     
