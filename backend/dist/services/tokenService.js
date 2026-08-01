"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../types/errors");
const generateToken = (payload) => {
    try {
        const tokenPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role || 'user',
        };
        // expiresIn can be a string like '7d' or a number in seconds
        const options = {
            expiresIn: config_1.config.jwt.expiresIn,
        };
        return jsonwebtoken_1.default.sign(tokenPayload, config_1.config.jwt.secret, options);
    }
    catch (error) {
        throw new errors_1.AppError('Failed to generate token', 500, 'TOKEN_GENERATION_ERROR');
    }
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        // Ensure required fields are present
        if (!decoded.userId || !decoded.email) {
            throw new errors_1.AppError('Invalid token payload', 401, 'INVALID_TOKEN');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errors_1.AppError('Token expired', 401, 'TOKEN_EXPIRED');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errors_1.AppError('Invalid token', 401, 'INVALID_TOKEN');
        }
        throw new errors_1.AppError('Token verification failed', 401, 'TOKEN_VERIFICATION_ERROR');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenService.js.map