/**
 * Production-ready logger utility
 * Provides structured logging with different log levels
 */
declare class Logger {
    private isDevelopment;
    private isProduction;
    private formatMessage;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, error?: Error | unknown, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
    private extractMetadata;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map