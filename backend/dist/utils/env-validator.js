"use strict";
/**
 * Environment variable validation
 * Ensures all required environment variables are present
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const envConfig = {
    required: [
        'MONGODB_URI',
        'JWT_SECRET',
        'FRONTEND_URL',
    ],
    optional: [
        'PORT',
        'NODE_ENV',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS',
        'JWT_EXPIRES_IN',
        'SESSION_SECRET',
    ],
};
const validateEnv = () => {
    const missing = [];
    envConfig.required.forEach((key) => {
        if (!process.env[key]) {
            missing.push(key);
        }
    });
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.');
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=env-validator.js.map