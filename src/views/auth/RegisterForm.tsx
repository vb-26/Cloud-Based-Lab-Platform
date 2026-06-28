import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';
import { UserRole } from '../../types';

interface RegisterFormProps {
  onRegister: (name: string, email: string, role: UserRole, password?: string) => void;
  onSwitch: () => void;
}

export const RegisterForm = ({ onRegister, onSwitch }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Create Account</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Join the next generation of lab practice</p>
      </div>

      <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); onRegister(name, email, role, password); }} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={name} 
            onChange={setName} 
            autoFocus 
            id="reg-name"
            icon={User}
          />
          <Input 
            label="Institutional Email" 
            placeholder="john@university.edu" 
            value={email} 
            onChange={setEmail} 
            id="reg-email"
            icon={Mail}
          />
          <Input 
            label="Create Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={setPassword} 
            id="reg-password"
            icon={Lock}
          />
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${
                  role === 'STUDENT' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-500/30'
                }`}
              >
                <User size={14} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('STAFF')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${
                  role === 'STAFF' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-500/30'
                }`}
              >
                <ShieldCheck size={14} />
                Instructor
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full py-4 text-sm group">
          Create My Account
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-indigo-600 hover:text-indigo-700 transition-colors">Sign In</button>
      </p>
    </motion.div>
  );
};
