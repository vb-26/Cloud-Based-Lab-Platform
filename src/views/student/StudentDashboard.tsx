import React from 'react';
import { FlaskConical, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Lab, User, LabSession } from '../../types';

interface StudentDashboardProps {
  labs: Lab[];
  users: User[];
  currentUser: User;
  onSetView: (view: string) => void;
  setActiveSession: (session: any) => void;
}

import { useStorage } from '../../contexts/StorageContext';

const getTimestamp = () => Date.now();

export const StudentDashboard = ({ 
  labs, 
  users, 
  currentUser, 
  setActiveSession, 
  onSetView 
}: StudentDashboardProps) => {
  const { startSession } = useStorage();
  
  const startLab = async (lab: Lab) => {
    const now = getTimestamp();
    const session: LabSession = {
      id: `session-${now}`,
      labId: lab.id,
      userId: currentUser.id,
      startTime: now,
      code: '// Write your code here\n\nfunction solution() {\n  console.log("Hello World");\n}',
      answers: {},
      status: 'active',
      progress: 0,
      totalScore: 0
    };
    try {
      await startSession(session);
      setActiveSession(session);
      onSetView('lab-session');
    } catch (error) {
      console.error("Failed to start lab session:", error);
    }
  };

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Available Labs</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.map(lab => (
          <Card key={lab.id} className="group relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <FlaskConical size={120} className="text-indigo-600" />
            </div>

            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl w-fit mb-6 border border-indigo-200">
              <FlaskConical size={24} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase italic leading-tight group-hover:text-indigo-600 transition-colors">{lab.name}</h3>
            <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Instructor: <span className="text-indigo-600">{users.find(u => u.id === lab.staffId)?.name}</span></p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Duration</p>
                <p className="text-lg font-black text-slate-900 italic">{lab.duration}m</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Modules</p>
                <p className="text-lg font-black text-slate-900 italic">{lab.questions.length}</p>
              </div>
            </div>

            {lab.questions.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-3">Lab Syllabus / Curriculum</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {lab.questions.map((q, i) => (
                    <div key={q.id} className="text-[11px] text-slate-500 flex items-start gap-3 group/item">
                      <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-indigo-600 rounded-lg text-[9px] font-black shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">{i + 1}</span>
                      <span className="flex-1 leading-relaxed group-hover/item:text-slate-900 transition-colors">{q.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full py-4 text-sm" onClick={() => startLab(lab)} icon={Play}>Initialize Lab Instance</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
