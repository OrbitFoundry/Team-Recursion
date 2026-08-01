'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { redirectToGoogleAuth } from '@/lib/auth-utils';
import { ArrowRightIcon } from '@/components/ui/Icons';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrors({ general: 'Authentication failed. Please check your credentials.' });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      if (apiError.response?.status === 429) {
        const errorMessage = apiError.response?.data?.error?.message || 'Too many authentication attempts. Please try again later.';
        setErrors({ general: errorMessage });
      } else {
        const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Login failed. Please try again.';
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    redirectToGoogleAuth();
  };

  const isGoogleAuthEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#c5b0f4] selection:text-black">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#161522] p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm relative overflow-hidden">
        
        {/* Accent Editorial Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#c5b0f4]" />

        {/* Brand Header */}
        <div className="text-center pt-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold flex items-center justify-center text-sm font-sans tracking-tight mb-4 shadow-sm">
            TR
          </div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1">
            TEAM RECURSION PLACEMENT PORTAL
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight dark:text-white">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-black dark:text-white underline hover:opacity-80">
              Sign up free
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-4 rounded-2xl">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="EMAIL ADDRESS"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="name@company.com"
            />
            <PasswordInput
              label="PASSWORD"
              name="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full py-3.5 flex items-center justify-center gap-2" isLoading={isLoading}>
              SIGN IN <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>

          {isGoogleAuthEnabled && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-3 bg-white dark:bg-[#161522] text-gray-500">OR CONTINUE WITH</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-3"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  GOOGLE SIGN IN
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
