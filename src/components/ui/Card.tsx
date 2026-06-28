import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'glass' | 'default';
  key?: string | number;
}

export const Card = ({ children, className = '', title, subtitle, action, variant = 'glass' }: CardProps) => {
  const baseStyles = "rounded-[2.5rem] overflow-hidden transition-all duration-300";
  const variants = {
    glass: "bg-white/70 backdrop-blur-xl border border-white/60 hover:bg-white/90 shadow-xl shadow-indigo-500/5",
    default: "bg-white border border-slate-200 hover:border-indigo-500/50 shadow-sm"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {(title || action) && (
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/30">
          <div>
            {title && <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{title}</h3>}
            {subtitle && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-8">{children}</div>
    </motion.div>
  );
};
