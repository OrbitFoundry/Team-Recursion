export interface TokenPayload {
    userId: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=tokenService.d.ts.map