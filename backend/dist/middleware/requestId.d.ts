import { Request, Response, NextFunction } from 'express';
export interface RequestWithId extends Request {
    id?: string;
}
/**
 * Middleware to add a unique request ID to each request
 * Helps with tracking and debugging in production
 */
export declare const requestId: (req: RequestWithId, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestId.d.ts.map