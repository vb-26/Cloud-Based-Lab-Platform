import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  className?: string;
  icon?: any;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  icon: Icon, 
  disabled = false, 
  type = 'button' 
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 border-transparent',
    secondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 border-transparent',
    ghost: 'bg-transparent text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-transparent',
    glass: 'bg-white/70 backdrop-blur-md border border-white/60 text-indigo-600 hover:bg-white/90 shadow-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
};
