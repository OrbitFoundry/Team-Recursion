'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only admins can access. Students are redirected to /dashboard */
  adminOnly?: boolean;
  /** If true, both admins and students can access without role redirection */
  allowBoth?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, allowBoth = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) router.push('/login');
      }, 100);
      return () => clearTimeout(timer);
    }

    if (allowBoth) return;

    // Admin-only page: redirect students away
    if (adminOnly && user && !isAdmin) {
      router.push('/dashboard');
    }

    // Non-admin pages: redirect admins to their dashboard
    if (!adminOnly && user && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, loading, user, adminOnly, allowBoth, router]);

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
  if (!allowBoth) {
    if (adminOnly && !isAdmin) return null;
    if (!adminOnly && isAdmin) return null;
  }

  return <>{children}</>;
}
