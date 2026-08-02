import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../services/tokenService';
export interface AuthRequest extends Request {
    user?: TokenPayload;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map