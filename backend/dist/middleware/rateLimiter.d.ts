import { Request, Response, NextFunction } from 'express';
/**
 * Rate limiters disabled as requested for login / signup
 */
export declare const authLimiter: (_req: Request, _res: Response, next: NextFunction) => void;
export declare const passwordResetLimiter: (_req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimiter.d.ts.map