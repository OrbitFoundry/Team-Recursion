"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../types/errors");
const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const isProduction = process.env.NODE_ENV === 'production';
    const isOperational = err instanceof errors_1.AppError ? err.isOperational : false;
    const requestId = req.id || 'unknown';
    // Log error for monitoring with request ID
    logger_1.logger.error(`Error ${statusCode} on ${req.method} ${req.path} [Request ID: ${requestId}]`, err);
    // Don't leak error details in production for non-operational errors
    const errorResponse = {
        error: {
            message: statusCode === 500 && isProduction && !isOperational
                ? 'Internal server error'
                : message,
            requestId,
        },
    };
    // Include error code if available
    if (err.code) {
        errorResponse.error.code = err.code;
    }
    // Include stack trace only in development
    if (!isProduction && err.stack) {
        errorResponse.error.stack = err.stack;
    }
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map