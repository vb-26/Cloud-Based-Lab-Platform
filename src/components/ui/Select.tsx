import React from 'react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (_value: any) => void;
  options: (string | { value: string; label: string })[];
  className?: string;
}

export const Select = ({ label, value, onChange, options, className = '' }: SelectProps) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
    >
      {options.map((opt: any) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);
