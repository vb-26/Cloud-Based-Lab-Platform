import React, { useState } from 'react';
import { Brain, Grid3X3, Layers, Bug, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Sudoku } from './games/Sudoku';
import { MindMatch } from './games/MindMatch';
import { DebuggingQuiz } from './games/DebuggingQuiz';

type GameType = 'SUDOKU' | 'MIND_MATCH' | 'DEBUG_QUIZ';

const FallbackGame = () => null;

export const StudentMindGames = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const games = [
    {
      id: 'SUDOKU' as GameType,
      title: 'Neural Grid',
      subtitle: 'Sudoku Logic',
      description: 'Strengthen pattern recognition and logical deduction with numerical grid processing.',
      icon: Grid3X3,
      color: 'bg-indigo-600',
      component: Sudoku
    },
    {
      id: 'MIND_MATCH' as GameType,
      title: 'Node Sync',
      subtitle: 'Memory Match',
      description: 'Enhance your short-term memory and focus by synchronizing technical nodes.',
      icon: Layers,
      color: 'bg-emerald-600',
      component: MindMatch
    },
    {
      id: 'DEBUG_QUIZ' as GameType,
      title: 'Bug Hunter',
      subtitle: 'Debugging IQ',
      description: 'Test your ability to spot structural vulnerabilities and logic leaks in cold code.',
      icon: Bug,
      color: 'bg-red-600',
      component: DebuggingQuiz
    }
  ];

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    const GameComponent = game?.component || FallbackGame;
    const gameInfo = game!;

    return (
      <div className="space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveGame(null)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all shadow-sm group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <gameInfo.icon className={`w-5 h-5 ${gameInfo.color.replace('bg-', 'text-')}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${gameInfo.color.replace('bg-', 'text-')}`}>{gameInfo.subtitle}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{gameInfo.title}</h2>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-xl shadow-slate-200/50"
        >
          <GameComponent />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative z-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-indigo-600" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Cognitive Core</span>
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Mind Training Lab</h2>
        <p className="text-slate-500 font-medium max-w-xl text-lg">
          Master the fundamentals of logical reasoning and pattern synchronization with our specialized cognitive modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.map((game, idx) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveGame(game.id)}
            className="group relative flex flex-col items-start p-10 bg-white rounded-[3rem] border border-slate-200 text-left hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className={`w-16 h-16 ${game.color} rounded-[1.5rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
              <game.icon size={32} />
            </div>
            
            <span className={`text-[10px] font-black uppercase tracking-widest mb-3 ${game.color.replace('bg-', 'text-')}`}>
              {game.subtitle}
            </span>
            
            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
              {game.title}
            </h3>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
              {game.description}
            </p>

            <div className="w-full flex items-center justify-between pt-6 border-t border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Load: Low</span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
