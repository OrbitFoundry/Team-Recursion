'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      Cookies.set('token', token, { 
        expires: 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      router.push('/dashboard');
    } else {
      router.push('/login?error=no_token');
    }
  }, [router, searchParams]);

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-white dark:bg-[#0c0b10] font-sans selection:bg-[#c5b0f4]">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent mx-auto"></div>
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-white dark:bg-[#0c0b10] font-sans selection:bg-[#c5b0f4]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent mx-auto"></div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

