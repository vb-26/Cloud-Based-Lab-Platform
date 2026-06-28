import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, CheckCircle2, AlertCircle, Trophy, RotateCcw, ChevronRight, Terminal } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DebugQuiz {
  id: string;
  title: string;
  description: string;
  buggyCode: string;
  correctCode: string;
  language: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const DEBUG_QUIZZES: DebugQuiz[] = [
  {
    id: '1',
    title: 'Python List Mutation',
    description: 'Find the bug that causes the loop to behave unexpectedly.',
    buggyCode: 'nums = [1, 2, 3]\nfor n in nums:\n    nums.remove(n)\nprint(nums)',
    correctCode: 'nums = [1, 2, 3]\nfor n in nums[:]:\n    nums.remove(n)\nprint(nums)',
    language: 'python',
    options: [
      'Removing elements while iterating skips items because the list size changes.',
      'The remove() method does not exist for lists.',
      'The loop should use a while loop instead.',
      'Python does not allow list modification inside a function.'
    ],
    correctOptionIndex: 0,
    explanation: 'When you remove an item from a list while iterating over it, the internal index continues to increment, causing it to skip the next item because everything has shifted left.'
  },
  {
    id: '2',
    title: 'JavaScript Async Loop',
    description: 'Why is the console printing the same number every time?',
    buggyCode: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
    correctCode: 'for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
    language: 'javascript',
    options: [
      'The timeout is too short.',
      'setTimeout does not work inside loops.',
      'var has function scope, and by the time the timeout runs, i is already 3.',
      'The console.log syntax is incorrect.'
    ],
    correctOptionIndex: 2,
    explanation: 'By using "var", the variable "i" is shared across all iterations. Since the loop finishes before the timeouts execute, they all see the final value of "i" (3). "let" provides block scope, creating a new "i" for each iteration.'
  },
  {
    id: '3',
    title: 'C++ Off-by-One',
    description: 'Identify the common memory access error in this array access.',
    buggyCode: 'int arr[5] = {1, 2, 3, 4, 5};\nfor(int i = 0; i <= 5; i++) {\n    cout << arr[i] << endl;\n}',
    correctCode: 'int arr[5] = {1, 2, 3, 4, 5};\nfor(int i = 0; i < 5; i++) {\n    cout << arr[i] << endl;\n}',
    language: 'cpp',
    options: [
      'The array is not initialized correctly.',
      'The loop condition i <= 5 accesses an out-of-bounds index at i=5.',
      'C++ arrays must start at index 1.',
      'Semi-colons are missing in the for loop.'
    ],
    correctOptionIndex: 1,
    explanation: 'An array of size 5 has valid indices from 0 to 4. Using i <= 5 means when i is 5, the program tries to access memory outside the array bounds, which leads to undefined behavior.'
  }
];

export const DebuggingQuiz = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuiz = DEBUG_QUIZZES[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQuiz.correctOptionIndex) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuiz = () => {
    if (currentIdx < DEBUG_QUIZZES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 mb-8">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Quiz Complete!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">You debugged {score} / {DEBUG_QUIZZES.length} modules correctly.</p>
        <Button onClick={resetQuiz} icon={RotateCcw} className="px-10 py-4 text-sm">Attempt Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 mb-2 inline-block">
            Bug Hunt: Module {currentIdx + 1}/{DEBUG_QUIZZES.length}
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{currentQuiz.title}</h2>
          <p className="text-slate-500 font-medium mt-1">{currentQuiz.description}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Score</p>
          <p className="text-2xl font-black text-indigo-600 italic">{score}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group mb-10">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Bug size={120} className="text-white" />
        </div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} className="text-indigo-400" />
            Vulnerable Code: {currentQuiz.language}
          </span>
        </div>
        <pre className="text-emerald-400 font-mono text-sm p-4 overflow-x-auto custom-scrollbar">
          {currentQuiz.buggyCode}
        </pre>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {currentQuiz.options.map((option, idx) => {
          const isCorrect = idx === currentQuiz.correctOptionIndex;
          const isSelected = selectedOption === idx;
          const status = selectedOption !== null 
            ? isCorrect ? 'correct' : isSelected ? 'incorrect' : 'neutral'
            : 'default';

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleOptionSelect(idx)}
              className={`
                w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-6
                ${status === 'default' ? 'bg-white border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50 group' : ''}
                ${status === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : ''}
                ${status === 'incorrect' ? 'bg-red-50 border-red-500 text-red-900' : ''}
                ${status === 'neutral' ? 'bg-white border-slate-100 opacity-50 grayscale' : ''}
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-all
                ${status === 'default' ? 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-indigo-500/50' : ''}
                ${status === 'correct' ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                ${status === 'incorrect' ? 'bg-red-500 border-red-500 text-white' : ''}
                ${status === 'neutral' ? 'bg-slate-50 border-slate-200 text-slate-300' : ''}
              `}>
                {status === 'correct' ? <CheckCircle2 size={18} /> : status === 'incorrect' ? <AlertCircle size={18} /> : String.fromCharCode(65 + idx)}
              </div>
              <span className="font-bold tracking-tight text-lg">{option}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`p-8 rounded-[2rem] border-2 ${selectedOption === currentQuiz.correctOptionIndex ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <h4 className="text-xs font-black uppercase tracking-widest mb-2 italic">Expert Rationale</h4>
              <p className="text-slate-700 font-medium leading-relaxed italic">{currentQuiz.explanation}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={nextQuiz} icon={ChevronRight} className="px-12 py-4">Next Challenge</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
