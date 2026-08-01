import apiClient from './api-client';
import {
  AuthResponse,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '@/types/auth';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string; techStacks?: string[] }): Promise<{ message: string; user: User }> => {
    const response = await apiClient.put('/auth/me', data);
    return response.data;
  },

  uploadResume: async (file: File): Promise<{ message: string; resumeUrl: string }> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await apiClient.post('/auth/me/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

