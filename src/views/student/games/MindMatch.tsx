import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github as Gh, Laptop, Terminal, Cpu, Database, Cloud, Shield, Zap, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const ICONS = [Gh, Laptop, Terminal, Cpu, Database, Cloud, Shield, Zap];

interface Card {
  id: number;
  icon: any;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MindMatch = () => {
  const [cards, setCards] = useState<Card[]>(() => {
    const pairIcons = [...ICONS, ...ICONS];
    return pairIcons
      .sort(() => Math.random() - 0.5)
      .map((Icon, idx) => ({
        id: idx,
        icon: Icon,
        isFlipped: false,
        isMatched: false
      }));
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = React.useCallback(() => {
    const pairIcons = [...ICONS, ...ICONS];
    const shuffled = pairIcons
      .sort(() => Math.random() - 0.5)
      .map((Icon, idx) => ({
        id: idx,
        icon: Icon,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  // Remove the initial useEffect that calls initializeGame() since we use lazy initialization in useState

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          checkWin();
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const checkWin = () => {
    setCards(prev => {
      const allMatched = prev.every(c => c.isMatched ||flippedCards.includes(c.id));
      if (allMatched) setIsWon(true);
      return prev;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-lg mb-8 items-center bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Moves</p>
          <p className="text-3xl font-black text-slate-900 italic">{moves}</p>
        </div>
        <Button variant="secondary" onClick={initializeGame} icon={RotateCcw}>Restart Game</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-lg">
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square rounded-3xl border-2 flex items-center justify-center transition-all shadow-lg
              ${card.isFlipped || card.isMatched 
                ? 'bg-indigo-600 border-indigo-500 text-white rotate-0' 
                : 'bg-white border-slate-200 text-slate-200 rotate-180'}
            `}
          >
            <div className={`transition-all duration-300 ${card.isFlipped || card.isMatched ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
              <card.icon size={32} />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-indigo-500/10"
          >
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Trophy size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-indigo-900 uppercase italic leading-none mb-1">Mental Titan!</h3>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">You matched all nodes in {moves} moves.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
