import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../services/tokenService';
export interface AuthRequest extends Request {
    user?: TokenPayload;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * adminOnly — pass-through for any authenticated user since roles are removed
 */
export declare const adminOnly: (_req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map