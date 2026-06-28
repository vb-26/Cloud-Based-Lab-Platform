import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

export const Toast = ({ toast }: ToastProps) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[100] ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
