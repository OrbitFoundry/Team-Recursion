'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';
import { CookedBrandIcon } from '@/components/ui/Icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { error?: { message: string } } }; message?: string };
      setError(apiError.response?.data?.error?.message || apiError.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-white dark:bg-[#0c0b10] px-4 font-sans selection:bg-[#c5b0f4] selection:text-black">
        <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#161522] p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c8e6cd]" />
          <div className="mx-auto w-12 h-12 rounded-full bg-[#c8e6cd] text-emerald-950 flex items-center justify-center font-bold text-xl shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">RESET LINK SENT</div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Check your email
          </h2>
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
            We sent a password reset link to <strong className="text-black dark:text-white">{email}</strong>
          </p>
          <p className="text-[11px] font-mono text-gray-400">
            The link will expire in 1 hour. If you don&apos;t see the email, check your spam folder.
          </p>
          <div className="pt-2">
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all shadow-sm">
              BACK TO LOGIN <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-white dark:bg-[#0c0b10] px-4 font-sans selection:bg-[#c5b0f4] selection:text-black">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5b0f4]" />

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-black dark:bg-white flex items-center justify-center mb-3 shadow-sm">
            <CookedBrandIcon className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">RECOVERY</div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">
            Enter your registered email and we&apos;ll dispatch a reset authorization link.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-3 rounded-2xl">
              {error}
            </div>
          )}

          <div>
            <Input
              label="REGISTERED EMAIL ADDRESS"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="name@company.com"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full py-3 rounded-full text-xs font-mono font-bold tracking-wider uppercase" isLoading={isLoading}>
              SEND RESET LINK
            </Button>
          </div>

          <div className="text-center pt-1">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
