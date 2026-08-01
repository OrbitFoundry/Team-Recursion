'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

function HomeContent() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [isAdmin, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0c0b10]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
        <p className="text-gray-500 dark:text-gray-400 font-mono text-xs uppercase tracking-wider font-bold">Redirecting to placement portal...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
