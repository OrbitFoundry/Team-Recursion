import { Request, Response, NextFunction } from 'express';

/**
 * Rate limiters disabled as requested for login / signup
 */
export const authLimiter = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export const passwordResetLimiter = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};


