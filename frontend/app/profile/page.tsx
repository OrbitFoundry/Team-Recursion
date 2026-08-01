'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { TechStackSelector } from '@/components/ui/TechStackSelector';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    techStacks: user?.techStacks || [],
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const handleTechStackChange = (stacks: string[]) => {
    setFormData({ ...formData, techStacks: stacks });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      await authApi.uploadResume(file);
      // Reload profile to get new resumeUrl
      await updateProfile({}); 
      showToast('Resume uploaded successfully', 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.error?.message || 'Failed to upload resume', 'error');
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = async () => {
    const newErrors: typeof errors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        techStacks: formData.techStacks,
      });
      setIsEditing(false);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: { message: string } } }; message?: string };
      const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Failed to update profile';
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('name')) {
        setErrors({ name: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 font-sans">
        <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 p-6 md:p-8 shadow-sm">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-gray-100 dark:border-gray-800/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#c5b0f4] text-black flex items-center justify-center font-bold text-2xl shadow-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight dark:text-white">{user?.name}</h2>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black">
                  STUDENT ACCOUNT
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setFormData({ name: user?.name || '', email: user?.email || '', techStacks: user?.techStacks || [] });
                  setIsEditing(true);
                }}
                className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                EDIT PROFILE
              </button>
            )}
          </div>

          {errors.general && (
            <div className="mt-6 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-mono p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              {errors.general}
            </div>
          )}

          {/* Profile Form */}
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                disabled={!isEditing}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
              {errors.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>}
            </div>

            <div className="bg-[#f4ecd6] dark:bg-gray-900/60 rounded-2xl p-5 border border-black/5 dark:border-gray-800/80">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                ACCOUNT VERIFICATION STATUS
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">EMAIL VERIFIED:</span>
                {user?.isEmailVerified ? (
                  <span className="px-3 py-1 bg-[#c8e6cd] text-emerald-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                    VERIFIED
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-200 text-amber-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                    UNVERIFIED
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Tech Stacks</h3>
              <TechStackSelector 
                selectedStacks={formData.techStacks} 
                onChange={handleTechStackChange} 
                disabled={!isEditing} 
              />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Resume</h3>
              <div className="flex flex-col gap-4">
                {user?.resumeUrl ? (
                  <a 
                    href={user.resumeUrl.startsWith('http') ? user.resumeUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.resumeUrl.startsWith('/') ? '' : '/'}${user.resumeUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white underline underline-offset-4 hover:opacity-80"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    View Current Resume
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No resume uploaded yet.</p>
                )}
                
                {isEditing && (
                  <div>
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                      UPLOAD NEW RESUME (PDF/DOC)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={isLoading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-300 transition-all disabled:opacity-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                >
                  {isLoading ? 'SAVING…' : 'SAVE CHANGES'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '', techStacks: user?.techStacks || [] });
                    setErrors({});
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
