"use strict";
/**
 * Production-ready logger utility
 * Provides structured logging with different log levels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.isProduction = process.env.NODE_ENV === 'production';
    }
    formatMessage(level, message, metadata) {
        const timestamp = new Date().toISOString();
        if (this.isProduction) {
            // Structured JSON logging for production
            const logEntry = {
                timestamp,
                level: level.toUpperCase(),
                message,
                ...(metadata && { metadata }),
            };
            return JSON.stringify(logEntry);
        }
        // Human-readable format for development
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
    info(message, ...args) {
        const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
        // eslint-disable-next-line no-console
        console.log(this.formatMessage('info', message, metadata), ...(this.isDevelopment ? args : []));
    }
    warn(message, ...args) {
        const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
        // eslint-disable-next-line no-console
        console.warn(this.formatMessage('warn', message, metadata), ...(this.isDevelopment ? args : []));
    }
    error(message, error, ...args) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        const metadata = {
            error: errorMessage,
            ...(errorStack && this.isProduction ? { stack: errorStack } : {}),
            ...this.extractMetadata(args),
        };
        // eslint-disable-next-line no-console
        console.error(this.formatMessage('error', message, metadata), ...(this.isDevelopment ? [error, ...args] : []));
        if (this.isDevelopment && errorStack) {
            // eslint-disable-next-line no-console
            console.error('Stack trace:', errorStack);
        }
    }
    debug(message, ...args) {
        if (this.isDevelopment) {
            const metadata = args.length > 0 ? this.extractMetadata(args) : undefined;
            // eslint-disable-next-line no-console
            console.log(this.formatMessage('debug', message, metadata), ...args);
        }
    }
    extractMetadata(args) {
        if (args.length === 0)
            return undefined;
        // If first argument is an object, use it as metadata
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !(args[0] instanceof Error)) {
            return args[0];
        }
        // Otherwise, create metadata object from all arguments
        const metadata = {};
        args.forEach((arg, index) => {
            if (typeof arg === 'object' && arg !== null && !(arg instanceof Error)) {
                Object.assign(metadata, arg);
            }
            else {
                metadata[`arg${index}`] = arg;
            }
        });
        return Object.keys(metadata).length > 0 ? metadata : undefined;
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map