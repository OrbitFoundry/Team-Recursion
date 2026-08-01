import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 font-mono">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-gray-200 dark:border-gray-800'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}
