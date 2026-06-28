import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Lab, User } from '../../types';

interface AdminLabsProps {
  labs: Lab[];
  users: User[];
  onSetView: (_view: string) => void;
}

export const AdminLabs = ({ labs, users, onSetView }: AdminLabsProps) => (
  <div className="space-y-10 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {labs.map(lab => (
        <Card key={lab.id} className="group relative">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl border border-indigo-200">
              <FlaskConical size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">By {users.find(u => u.id === lab.staffId)?.name}</span>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase italic leading-tight group-hover:text-indigo-600 transition-colors">{lab.name}</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Duration</p>
              <p className="text-sm font-black text-slate-900 italic">{lab.duration}m</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Capacity</p>
              <p className="text-sm font-black text-slate-900 italic">{lab.maxStudents}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Type</p>
              <p className="text-[10px] font-black text-indigo-600 italic truncate">{lab.serverType}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
              {lab.questions.length} Modules
            </span>
            <Button variant="ghost" className="text-[10px] px-4 py-2" onClick={() => onSetView('monitoring')}>Monitor</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
