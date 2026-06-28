import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (_value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  id?: string;
  icon?: LucideIcon;
}

export const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  autoFocus = false, 
  id,
  icon: Icon
}: InputProps) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full ${Icon ? 'pl-12' : 'px-5'} py-4 bg-white rounded-2xl border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium`}
      />
    </div>
  </div>
);
