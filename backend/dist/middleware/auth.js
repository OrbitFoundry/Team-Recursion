"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authenticate = void 0;
const tokenService_1 = require("../services/tokenService");
const errors_1 = require("../types/errors");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: {
                    message: 'No token provided. Please authenticate.',
                    code: 'NO_TOKEN',
                },
            });
            return;
        }
        const token = authHeader.substring(7);
        if (!token || token.trim() === '') {
            res.status(401).json({
                error: {
                    message: 'Invalid token format. Please authenticate again.',
                    code: 'INVALID_TOKEN_FORMAT',
                },
            });
            return;
        }
        const decoded = (0, tokenService_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            res.status(error.statusCode).json({
                error: {
                    message: error.message,
                    code: error.code,
                },
            });
            return;
        }
        res.status(401).json({
            error: {
                message: 'Invalid or expired token. Please authenticate again.',
                code: 'AUTH_ERROR',
            },
        });
    }
};
exports.authenticate = authenticate;
const adminOnly = (req, res, next) => {
    const authReq = req;
    if (!authReq.user || authReq.user.role !== 'admin') {
        res.status(403).json({
            error: {
                message: 'Access denied. Administrator privileges required.',
                code: 'FORBIDDEN',
            },
        });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=auth.js.map