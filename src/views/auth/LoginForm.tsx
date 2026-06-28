import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (email: string, password?: string) => void;
  onSwitch: () => void;
}

export const LoginForm = ({ onLogin, onSwitch }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Welcome Back</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enter your credentials to access your lab</p>
      </div>

      <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); onLogin(email, password); }} className="space-y-5">
        <div className="space-y-4">
          <Input 
            label="Email Address" 
            placeholder="name@university.edu" 
            value={email} 
            onChange={setEmail} 
            autoFocus 
            id="login-email"
            icon={Mail}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={setPassword} 
            id="login-password"
            icon={Lock}
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700">Remember me</span>
          </label>
          <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Forgot Password?</button>
        </div>

        <Button type="submit" className="w-full py-4 text-sm group">
          Sign In to Portal
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
          <span className="bg-white px-4 text-slate-400">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" className="py-3 gap-2">
          <Chrome size={16} />
          Google
        </Button>
        <Button variant="secondary" className="py-3 gap-2">
          <Github size={16} />
          GitHub
        </Button>
      </div>

      <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-indigo-600 hover:text-indigo-700 transition-colors">Create Account</button>
      </p>
    </motion.div>
  );
};
