'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) router.push('/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0c0b10]">
        <div className="flex flex-col items-center gap-4 font-mono">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">VERIFYING ACCESS…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
