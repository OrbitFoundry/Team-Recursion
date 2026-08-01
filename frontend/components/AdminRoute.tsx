'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0c0b10]">
        <div className="flex flex-col items-center gap-4 font-mono">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">VERIFYING AUTHENTICATION…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
