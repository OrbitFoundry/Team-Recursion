'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';
import { validatePassword } from '@/lib/password-validation';
import Cookies from 'js-cookie';

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
        newErrors.password = passwordValidation.errors[0]; // Show first error
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

      // Show success message
      setIsSuccess(true);
      showToast('Password reset successful! Logging you in...', 'success');

      // Set the token cookie with proper security settings
      const cookieOptions = {
        expires: 7,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      };

      Cookies.set('token', response.token, cookieOptions);
      
      // The token is now set. When the user navigates to /home,
      // AuthContext will automatically verify the token and set the user state.
      // ProtectedRoute will handle the authentication check.

      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push('/home');
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
      
      // Handle specific error cases
      if (apiError.response?.status === 400) {
        if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
          errorMessage = 'This password reset link is invalid or has expired. Please request a new one.';
          setErrors({ general: errorMessage });
        } else if (errorMessage.includes('password') || errorMessage.includes('Password')) {
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

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been reset successfully. You are being logged in...
            </p>
            <div className="mt-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
          {!token && (
            <p className="mt-2 text-center text-sm text-red-600">
              No reset token found. Please use the link from your email.
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
          <div className="space-y-4">
            <PasswordInput
              label="New password"
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your new password (min. 8 characters, uppercase, lowercase, number, special char)"
              showStrength={true}
            />
            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
            />
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={!token}>
              Reset password
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to login
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

