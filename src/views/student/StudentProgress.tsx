import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle2, ChevronRight, Eye, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LabSession, Lab, User } from '../../types';

interface StudentProgressProps {
  sessions: LabSession[];
  labs: Lab[];
  currentUser: User;
}

export const StudentProgress = ({ sessions, labs, currentUser }: StudentProgressProps) => {
  const completedSessions = sessions.filter(s => s.userId === currentUser.id && s.status === 'completed');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const calculateMaxPoints = (lab?: Lab) => {
    if (!lab) return 0;
    return lab.questions.reduce((sum, q) => sum + q.points, 0);
  };

  const calculateScorePercentage = (session: LabSession, lab?: Lab) => {
    if (!lab || lab.questions.length === 0) return 0;
    const maxPoints = calculateMaxPoints(lab);
    if (maxPoints === 0) return 0;
    
    const sessionScore = session.totalScore !== undefined ? session.totalScore : 0;
    return Math.round((sessionScore / maxPoints) * 100);
  };
  
  return (
    <div className="space-y-10 relative z-10">
      {completedSessions.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <LayoutDashboard size={64} className="mx-auto text-slate-300 mb-6" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">You haven't completed any labs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {completedSessions.map(session => {
            const lab = labs.find(l => l.id === session.labId);
            const scorePercentage = calculateScorePercentage(session, lab);
            const maxPoints = calculateMaxPoints(lab);
            const gainedPoints = session.totalScore || 0;
            const isSelected = selectedSessionId === session.id;

            return (
              <Card key={session.id} className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{lab?.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Completed on {new Date(session.startTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Marks</p>
                      <p className="text-2xl font-black italic text-slate-900">{gainedPoints} / {maxPoints}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Percentage</p>
                      <p className={`text-3xl font-black italic ${scorePercentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{scorePercentage}%</p>
                    </div>
                    <Button variant="ghost" icon={isSelected ? ChevronRight : Eye} onClick={() => setSelectedSessionId(isSelected ? null : session.id)} className="text-[10px] px-6 py-3">
                      {isSelected ? 'Collapse' : 'Review'}
                    </Button>
                  </div>
                </div>

                {isSelected && lab && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-10 pt-10 border-t border-slate-100 space-y-8"
                  >
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                      <FlaskConical size={18} className="text-indigo-600" />
                      Post-Lab Assessment Review
                    </h5>
                    <div className="grid grid-cols-1 gap-6">
                      {lab.questions.map((q, idx) => {
                        const answer = session.answers[q.id];
                        const isCorrect = q.type === 'mcq' ? answer === q.correctAnswer : answer === 1;
                        return (
                          <div key={q.id} className={`p-8 rounded-[2rem] border-2 transition-all ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex justify-between items-start gap-6 mb-6">
                              <p className="text-lg font-bold text-slate-900 leading-relaxed flex-1 italic">{idx + 1}. {q.text}</p>
                              <div className="flex flex-col items-end shrink-0">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border mb-2 ${isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 italic">Score: {isCorrect ? q.points : 0} / {q.points}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                Your Response: <span className={`font-black italic ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {answer !== undefined 
                                    ? (q.type === 'mcq' ? q.options[answer] : 'Code Verified') 
                                    : 'None'}
                                </span>
                              </p>
                              {!isCorrect && q.type === 'mcq' && (
                                <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Correct Answer: <span className="italic">{q.options[q.correctAnswer]}</span></p>
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
                  </motion.div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
