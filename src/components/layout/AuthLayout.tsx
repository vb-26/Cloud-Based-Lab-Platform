import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backToHome?: boolean;
  onBackToHome?: () => void;
}

export const AuthLayout = ({ title, subtitle, children, backToHome = true, onBackToHome }: AuthLayoutProps) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
    {/* Decorative Background Elements */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-white overflow-hidden max-w-lg w-full p-12 relative z-10"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-[1.5rem] mb-6 shadow-lg shadow-indigo-600/20">
          <FlaskConical size={32} />
        </div>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{title}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-3">{subtitle}</p>
      </div>
      
      <div className="relative">
        {children}
      </div>

      {backToHome && (
        <button 
          onClick={onBackToHome}
          className="mt-10 w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">←</span> Back to Home
        </button>
      )}
    </motion.div>
  </div>
);
