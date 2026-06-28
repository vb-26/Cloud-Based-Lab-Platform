import React from 'react';
import { Users, FlaskConical, Monitor, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Lab, LabSession } from '../../types';
import { useStorage } from '../../contexts/StorageContext';

interface AdminStatsProps {
  users: User[];
  labs: Lab[];
  sessions: LabSession[];
}

export const AdminStats = ({ users, labs, sessions }: AdminStatsProps) => {
  const { resetSystemData } = useStorage();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all system data? This will clear all users, labs, and sessions and restore defaults.')) {
      resetSystemData();
    }
  };

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">System Overview</h2>
        <Button variant="danger" icon={RotateCcw} onClick={handleReset}>
          Reset System Data
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="relative group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30">
              <Users size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Staff Members</p>
              <p className="text-3xl font-black text-white italic">{users.filter(u => u.role === 'STAFF').length}</p>
            </div>
          </div>
        </Card>
        <Card className="relative group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-500/30">
              <Users size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Students</p>
              <p className="text-3xl font-black text-white italic">{users.filter(u => u.role === 'STUDENT').length}</p>
            </div>
          </div>
        </Card>
        <Card className="relative group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
              <FlaskConical size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Active Labs</p>
              <p className="text-3xl font-black text-white italic">{labs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="relative group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
              <Monitor size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Live Sessions</p>
              <p className="text-3xl font-black text-white italic">{sessions.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
