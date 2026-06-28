import React from 'react';
import { FlaskConical, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { User, NavItem } from '../../types';

interface SidebarProps {
  currentUser: User;
  navItems: NavItem[];
  view: string;
  onSetView: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ currentUser, navItems, view, onSetView, onLogout }: SidebarProps) => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 -left-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 -right-20 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="p-8 flex items-center gap-3 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/30"
        >
          <FlaskConical size={24} />
        </motion.div>
        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Virtual<span className="text-indigo-600">Lab</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        {navItems.map(item => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSetView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group ${
              view === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <item.icon size={18} className={view === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
            <span className="flex-1 text-left font-black uppercase tracking-widest text-[10px]">{item.label}</span>
            {view === item.id && <ChevronRight size={14} className="text-white/50" />}
          </motion.button>
        ))}
      </nav>

      <div className="p-6 relative z-10">
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-4 flex items-center gap-3 mb-4 group hover:bg-indigo-50 transition-all">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate uppercase italic">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.role}</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-200"
        >
          <LogOut size={16} />
          Logout
        </motion.button>
      </div>
    </aside>
  );
};
