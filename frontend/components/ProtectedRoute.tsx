'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only admins can access. Students are redirected to /dashboard */
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
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

    // Admin-only page: redirect students away
    if (adminOnly && user && !isAdmin) {
      router.push('/dashboard');
    }

    // Non-admin pages: redirect admins to their dashboard
    if (!adminOnly && user && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, loading, user, adminOnly, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;
  if (!adminOnly && isAdmin) return null;

  return <>{children}</>;
}
