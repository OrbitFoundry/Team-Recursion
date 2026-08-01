/**
 * Type definitions for API errors
 */

export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        message: string;
        errors?: string[];
        code?: string;
      };
    };
    status?: number;
  };
  message?: string;
}

export interface ValidationError {
  message: string;
  errors: string[];
}

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    errors?: string[];
    stack?: string;
  };
}

export class AppError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

