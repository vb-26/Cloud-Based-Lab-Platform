import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// A simple Sudoku generator/validator
const isValid = (board: number[][], row: number, col: number, num: number) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
};

const solve = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateSudoku = () => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  solve(board);
  const puzzle = board.map(row => [...row]);
  // Remove some numbers
  for (let i = 0; i < 40; i++) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    puzzle[r][c] = 0;
  }
  return { puzzle, solution: board };
};

export const Sudoku = () => {
  const [game, setGame] = useState(() => generateSudoku());
  const [board, setBoard] = useState(game.puzzle.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const isComplete = board.every((row, ri) => 
    row.every((cell, ci) => cell === game.solution[ri][ci])
  );

  const handleCellClick = (r: number, c: number) => {
    if (game.puzzle[r][c] !== 0) return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);
  };

  const resetGame = () => {
    const newGame = generateSudoku();
    setGame(newGame);
    setBoard(newGame.puzzle.map(row => [...row]));
    setSelectedCell(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-9 border-4 border-slate-900 bg-slate-900 shadow-2xl rounded-xl overflow-hidden mb-8">
        {board.map((row, ri) => (
          row.map((cell, ci) => {
            const isSelected = selectedCell?.[0] === ri && selectedCell?.[1] === ci;
            const isInitial = game.puzzle[ri][ci] !== 0;
            const isError = cell !== 0 && cell !== game.solution[ri][ci];
            
            return (
              <button
                key={`${ri}-${ci}`}
                onClick={() => handleCellClick(ri, ci)}
                className={`
                  w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-lg sm:text-2xl font-black transition-all
                  ${(ri + 1) % 3 === 0 && ri !== 8 ? 'border-b-2 border-slate-700' : 'border-b border-slate-800'}
                  ${(ci + 1) % 3 === 0 && ci !== 8 ? 'border-r-2 border-slate-700' : 'border-r border-slate-800'}
                  ${isInitial ? 'bg-slate-50 text-slate-400' : 'bg-white text-indigo-600'}
                  ${isSelected ? 'bg-indigo-100 !text-indigo-600 !border-indigo-500 z-10' : ''}
                  ${isError && !isInitial ? 'bg-red-50 !text-red-500' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </button>
            );
          })
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="grid grid-cols-9 gap-2 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="aspect-square rounded-xl bg-white border border-slate-200 text-slate-900 font-black hover:bg-slate-50 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={resetGame} icon={RotateCcw}>New Board</Button>
          <Button variant="ghost" onClick={() => {
            if (selectedCell) {
              const [r, c] = selectedCell;
              const newBoard = board.map(row => [...row]);
              newBoard[r][c] = game.solution[r][c];
              setBoard(newBoard);
            }
          }} icon={Lightbulb}>Hint</Button>
        </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-emerald-500/10"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Trophy size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900 uppercase italic leading-none mb-1">Sudoku Master!</h3>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">You solved the module successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
