"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetLimiter = exports.authLimiter = void 0;
/**
 * Rate limiters disabled as requested for login / signup
 */
const authLimiter = (_req, _res, next) => {
    next();
};
exports.authLimiter = authLimiter;
const passwordResetLimiter = (_req, _res, next) => {
    next();
};
exports.passwordResetLimiter = passwordResetLimiter;
//# sourceMappingURL=rateLimiter.js.map