import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, Key } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';

interface AdminLoginFormProps {
  onLogin: (email: string, password?: string) => void;
  onBack?: () => void;
}

export const AdminLoginForm = ({ onLogin, onBack }: AdminLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-lg shadow-red-500/10">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Access</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Authorized Personnel Only</p>
      </div>

      <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); onLogin(email, password); }} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Admin Identifier" 
            placeholder="admin@virtual-lab.io" 
            value={email} 
            onChange={setEmail} 
            autoFocus 
            id="admin-email"
            icon={Key}
          />
          <Input 
            label="Security Token" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={setPassword} 
            id="admin-password"
            icon={Lock}
          />
        </div>

        <Button type="submit" variant="danger" className="w-full py-4 text-sm group">
          Authenticate Access
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {onBack && (
        <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Not an administrator?{' '}
          <button type="button" onClick={onBack} className="text-indigo-600 hover:text-indigo-700 transition-colors">Return to Home</button>
        </p>
      )}
    </motion.div>
  );
};
