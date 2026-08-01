"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const crypto_1 = require("crypto");
/**
 * Middleware to add a unique request ID to each request
 * Helps with tracking and debugging in production
 */
const requestId = (req, res, next) => {
    // Use existing X-Request-ID header or generate a new one
    const requestId = req.headers['x-request-id'] || (0, crypto_1.randomUUID)();
    req.id = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
};
exports.requestId = requestId;
//# sourceMappingURL=requestId.js.map