import React, { useState } from 'react';
import { Monitor, Eye, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LabSession, User, Lab } from '../../types';

interface StaffMonitoringProps {
  sessions: LabSession[];
  users: User[];
  labs: Lab[];
}

export const StaffMonitoring = ({ sessions, users, labs }: StaffMonitoringProps) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const activeSessions = sessions.filter(s => s.status === 'active');
  
  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Live Monitoring</h2>
        <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl font-black uppercase tracking-widest border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {activeSessions.length} Students Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeSessions.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <Monitor size={64} className="mx-auto text-slate-300 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">No active student sessions at the moment.</p>
          </div>
        ) : (
          activeSessions.map(session => {
            const student = users.find(u => u.id === session.userId);
            const lab = labs.find(l => l.id === session.labId);
            const isSelected = selectedSessionId === session.id;

            return (
              <Card key={session.id} className={isSelected ? 'ring-2 ring-indigo-500/50' : ''}>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-600/20">
                        {student?.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{student?.name}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Working on: <span className="text-indigo-600">{lab?.name}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex-1 max-w-md">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-indigo-600">{session.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${session.progress}%` }}
                          className="bg-indigo-600 h-full rounded-full shadow-sm" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Score</p>
                        <p className="text-xl font-black text-indigo-600 italic">
                          {session.totalScore || 0} / {lab?.questions.reduce((sum, q) => sum + q.points, 0) || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Modules</p>
                        <p className="text-xl font-black text-slate-900 italic">{Object.keys(session.answers).length} / {lab?.questions.length}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" icon={Eye} onClick={() => setSelectedSessionId(isSelected ? null : session.id)} className="text-[10px] px-6 py-3">
                          {isSelected ? 'Collapse' : 'Inspect'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isSelected && lab && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-slate-100 pt-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col h-[500px] shadow-inner">
                          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                              <CheckCircle size={18} className="text-emerald-500" />
                              Student Assessment Record
                            </h5>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {Object.keys(session.answers).length} / {lab.questions.length} Modules
                            </span>
                          </div>
                          
                          <div className="flex-1 flex overflow-hidden">
                            {/* Monitoring Sidebar */}
                            <div className="w-16 border-r border-slate-100 bg-slate-50/30 flex flex-col items-center py-6 gap-3 overflow-y-auto custom-scrollbar shrink-0">
                                {lab.questions.map((q, idx) => {
                                  const answer = session.answers[q.id];
                                  const isCorrect = q.type === 'mcq' ? answer === q.correctAnswer : answer === 1;
                                  const isAnswered = answer !== undefined;
                                  
                                  return (
                                    <motion.button
                                      key={idx}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => {
                                        const el = document.getElementById(`monitor-q-${session.id}-${idx}`);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                      }}
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all shrink-0 border-2 ${
                                        isAnswered 
                                          ? isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                          : 'bg-slate-100 text-slate-400 border-transparent'
                                      }`}
                                    >
                                      {idx + 1}
                                    </motion.button>
                                  );
                                })}
                            </div>

                            {/* Monitoring Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                              {lab.questions.map((q, idx) => {
                                const answer = session.answers[q.id];
                                const isCorrect = q.type === 'mcq' ? answer === q.correctAnswer : answer === 1;
                                return (
                                    <div 
                                      key={q.id} 
                                      id={`monitor-q-${session.id}-${idx}`}
                                      className="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:border-indigo-200 group/q"
                                    >
                                      <div className="flex justify-between items-start gap-6 mb-4">
                                        <span className="font-bold text-slate-900 text-sm leading-relaxed italic">{idx + 1}. {q.text}</span>
                                        <div className="flex flex-col items-end shrink-0">
                                          {answer !== undefined && (
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border mb-2 ${isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                              {isCorrect ? 'Correct' : 'Incorrect'}
                                            </span>
                                          )}
                                          <span className="text-[9px] font-black text-slate-400 italic">Marks: {isCorrect ? q.points : 0} / {q.points}</span>
                                        </div>
                                      </div>
                                    <div className="space-y-3">
                                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        Student Response: <span className={`font-black italic ${answer !== undefined ? 'text-indigo-600' : 'text-slate-300'}`}>
                                          {answer !== undefined 
                                            ? (q.type === 'mcq' ? q.options[answer] : 'Code Submitted & Evaluated')
                                            : 'Pending...'}
                                        </span>
                                      </p>
                                      {answer !== undefined && !isCorrect && q.type === 'mcq' && (
                                        <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">
                                          Expected: <span className="italic">{q.options[q.correctAnswer]}</span>
                                        </p>
                                      )}
                                      {q.explanation && (
                                        <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed italic">
                                          <span className="font-black text-slate-400 not-italic uppercase tracking-widest mr-2 text-[9px]">Rationale:</span>
                                          {q.explanation}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
