'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';
import { validatePassword } from '@/lib/password-validation';
import Cookies from 'js-cookie';
import { CheckIcon } from '@/components/ui/Icons';

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset.' });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    } else {
      newErrors.password = 'Password is required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset link.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.resetPassword({
        token,
        password: formData.password,
      });

      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      setIsSuccess(true);
      showToast('Password reset successful! Logging you in...', 'success');

      const cookieOptions = {
        expires: 7,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      };

      Cookies.set('token', response.token, cookieOptions);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const apiError = err as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      let errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Password reset failed. Please try again.';
      
      if (apiError.response?.status === 400) {
        if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
          errorMessage = 'This password reset link is invalid or has expired. Please request a new one.';
          setErrors({ general: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (apiError.response?.status === 429) {
        errorMessage = 'Too many password reset attempts. Please try again later.';
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
      
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#c5b0f4] selection:text-black">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#c8e6cd]" />
          <div className="mx-auto w-14 h-14 rounded-full bg-[#c8e6cd] text-emerald-950 flex items-center justify-center shadow-sm">
            <CheckIcon className="w-7 h-7 text-emerald-950" />
          </div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">CREDENTIALS UPDATED</div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Password Reset Successful!
          </h2>
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
            Your credentials have been updated securely. Redirecting to your dashboard...
          </p>
          <div className="pt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#c5b0f4] selection:text-black">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm relative overflow-hidden">
        
        {/* Accent Editorial Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#efd4d4]" />

        {/* Brand Header */}
        <div className="text-center pt-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold flex items-center justify-center text-sm font-sans tracking-tight mb-4 shadow-sm">
            TR
          </div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">SECURITY RECOVERY</div>
          <h2 className="text-2xl font-extrabold tracking-tight dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
            Enter your new secure password below
          </p>
          {!token && (
            <p className="mt-2 text-xs font-mono text-rose-500 font-medium">
              No reset token detected. Please use the link sent to your email.
            </p>
          )}
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-4 rounded-2xl">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <PasswordInput
              label="NEW PASSWORD"
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Min. 8 characters"
              showStrength={true}
            />
            <PasswordInput
              label="CONFIRM NEW PASSWORD"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repeat new password"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full py-3.5 mt-2" isLoading={isLoading} disabled={!token}>
              SET NEW PASSWORD
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
