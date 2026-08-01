export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isEmailVerified: boolean;
  techStacks?: string[];
  resumeUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}
