'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, LoginData, RegisterData } from '@/types/auth';
import { authApi } from '@/lib/auth-api';
import { showToast } from '@/components/ToastProvider';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; techStacks?: string[] }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Check for token immediately on mount (before checkAuth runs)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let token = Cookies.get('token');
      if (!token && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
          token = decodeURIComponent(tokenCookie.split('=')[1].trim());
        }
      }
      setHasToken(!!token);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      let token = Cookies.get('token');
      if (!token && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }

      if (!token) {
        setLoading(false);
        setUser(null);
        setHasToken(false);
        return;
      }

      setHasToken(true);

      const response = await authApi.getCurrentUser();
      if (response?.user) {
        setUser(response.user);
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          status?: number;
          data?: { error?: { message: string } };
        };
        message?: string;
      };

      if (apiError.response?.status === 401) {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('token');
        setUser(null);
        setHasToken(false);
        logger.debug('Auth check: Token invalid or expired - logging out');
      } else {
        const token = Cookies.get('token');
        setHasToken(!!token);
        if (apiError.response?.status === 429) {
          logger.warn('Rate limited during auth check - keeping session');
        } else if (!apiError.response) {
          logger.warn('Network error during auth check - keeping session');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    const response = await authApi.login(data);

    if (!response.token) {
      throw new Error('No token received from server');
    }

    const cookieOptions = {
      expires: 7,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    try {
      Cookies.set('token', response.token, cookieOptions);
      setHasToken(true);
    } catch (error) {
      logger.error('Error setting authentication cookie', error);
      setHasToken(true);
    }

    setUser(response.user);
    showToast('Login successful!', 'success');
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);

    if (!response.token) {
      throw new Error('No token received from server');
    }

    const cookieOptions = {
      expires: 7,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    try {
      Cookies.set('token', response.token, cookieOptions);
      setHasToken(true);
    } catch (error) {
      logger.error('Error setting authentication cookie', error);
      setHasToken(true);
    }

    setUser(response.user);
    showToast('Account created successfully!', 'success');
  };

  const updateProfile = async (data: { name?: string; email?: string; techStacks?: string[] }) => {
    const response = await authApi.updateProfile(data);
    if (response?.user) {
      setUser(response.user);
      showToast('Profile updated successfully!', 'success');
    }
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token');
    setUser(null);
    setHasToken(false);
  };

  const isAuthenticated = !!user || hasToken;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
