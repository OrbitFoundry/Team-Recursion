'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';

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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#c5b0f4] selection:text-black">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#c8e6cd] text-emerald-950 flex items-center justify-center font-bold text-xl shadow-sm">
            ✓
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
          <div className="pt-4">
            <Link href="/login" className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all">
              BACK TO LOGIN →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#c5b0f4] selection:text-black">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold flex items-center justify-center text-sm font-sans tracking-tight mb-4 shadow-sm">
            TR
          </div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">RECOVERY</div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
            Enter your registered email and we&apos;ll dispatch a reset authorization link.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-4 rounded-2xl">
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
            <Button type="submit" variant="primary" className="w-full py-3.5" isLoading={isLoading}>
              SEND RESET LINK
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
