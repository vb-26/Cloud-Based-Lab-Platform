import React from 'react';
import { Bell, Search } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  view: string;
  currentUser: User;
}

export const Header = ({ view, currentUser }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
          {view === 'dashboard' ? 'Dashboard' : view.charAt(0).toUpperCase() + view.slice(1)}
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
          Welcome back, <span className="text-indigo-600">{currentUser.name}</span>
        </p>
      </div>
      
     
    </header>
  );
};
