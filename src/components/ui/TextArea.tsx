import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const TextArea = ({ label, value, onChange, placeholder, className = '', rows = 3 }: TextAreaProps) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
    />
  </div>
);
