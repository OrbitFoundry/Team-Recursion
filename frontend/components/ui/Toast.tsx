'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: 'bg-[#c8e6cd] text-emerald-950 border-emerald-300',
    error: 'bg-rose-100 text-rose-950 border-rose-300',
    info: 'bg-[#c5b0f4] text-purple-950 border-purple-300',
  };

  const badges = {
    success: '✓ SUCCESS',
    error: '✕ ERROR',
    info: 'ℹ INFO',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full border shadow-xl ${colors[type]} animate-fade-in-up font-sans backdrop-blur-md`}>
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 text-current">
        {badges[type]}
      </span>
      <p className="text-xs font-semibold text-current pr-1">{message}</p>
      <button
        onClick={onClose}
        className="w-5 h-5 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-current text-xs font-bold transition-all"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
