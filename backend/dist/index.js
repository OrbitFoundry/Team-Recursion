"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const env_validator_1 = require("./utils/env-validator");
require("./config/passport");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const requestId_1 = require("./middleware/requestId");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
const keepAliveService_1 = require("./services/keepAliveService");
// Validate environment variables on startup
try {
    (0, env_validator_1.validateEnv)();
    logger_1.logger.info('Environment variables validated');
}
catch (error) {
    logger_1.logger.error('Environment validation failed', error);
    process.exit(1);
}
const app = (0, express_1.default)();
// Trust proxy - Required when running behind a reverse proxy (Render, Heroku, etc.)
// This enables Express to correctly identify the client's IP address
app.set('trust proxy', 1);
// Connect to database (required for authentication)
(0, database_1.connectDatabase)().catch((error) => {
    logger_1.logger.error('Failed to connect to database', error);
    process.exit(1);
});
// Request ID middleware (must be early to track all requests)
app.use(requestId_1.requestId);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: config_1.config.nodeEnv === 'production',
    crossOriginEmbedderPolicy: false,
}));
// CORS middleware
const allowedOrigins = [
    config_1.config.frontend.url,
    'https://kalviumiscooked.netlify.app',
    'https://team-recursion-placement-portal.netlify.app',
    ...(config_1.config.nodeEnv === 'development' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : []),
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [])
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        // Check if origin is in allowed list or is a Netlify domain
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.netlify.app') ||
            config_1.config.nodeEnv === 'development') {
            callback(null, true);
        }
        else {
            logger_1.logger.warn(`CORS: Blocked request from origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400,
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files (like resumes) from the uploads directory
app.use('/uploads', express_1.default.static('uploads'));
// Session middleware for Passport
// Use MongoDB session store in production, MemoryStore in development
const sessionConfig = {
    secret: config_1.config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config_1.config.nodeEnv === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: config_1.config.nodeEnv === 'production' ? 'none' : 'lax',
    },
};
// Use MongoDB session store in production
if (config_1.config.nodeEnv === 'production') {
    sessionConfig.store = connect_mongo_1.default.create({
        mongoUrl: config_1.config.database.uri,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 24 hours
        autoRemove: 'native',
    });
    logger_1.logger.info('Using MongoDB session store');
}
else {
    logger_1.logger.debug('Using MemoryStore for sessions (development only)');
}
app.use((0, express_session_1.default)(sessionConfig));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Basic route
app.get('/', (_req, res) => {
    res.json({
        message: 'Welcome to Express API',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});
// Health check route (should be accessible without CORS restrictions)
app.get('/health', async (_req, res) => {
    try {
        const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
        const health = {
            status: dbStatus === 'connected' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            database: dbStatus,
            uptime: process.uptime(),
        };
        const statusCode = dbStatus === 'connected' ? 200 : 503;
        res.status(statusCode).json(health);
    }
    catch (error) {
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            database: 'error',
        });
    }
});
// Health check HEAD endpoint (for load balancers and monitoring)
app.head('/health', async (_req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).end();
});
// Google OAuth routes (only if configured)
if (config_1.config.google.clientId && config_1.config.google.clientSecret) {
    app.get('/api/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/api/auth/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: `${config_1.config.frontend.url}/login?error=google_auth_failed` }), async (req, res) => {
        try {
            // The user data is returned from the Passport strategy
            const authResult = req.user;
            if (authResult?.token) {
                const frontendUrl = config_1.config.frontend.url;
                res.redirect(`${frontendUrl}/auth/callback?token=${authResult.token}`);
            }
            else {
                res.redirect(`${config_1.config.frontend.url}/login?error=google_auth_failed`);
            }
        }
        catch (error) {
            res.redirect(`${config_1.config.frontend.url}/login?error=google_auth_failed`);
        }
    });
}
else {
    // Placeholder routes if Google OAuth is not configured
    app.get('/api/auth/google', (_req, res) => {
        res.status(501).json({ error: { message: 'Google OAuth is not configured' } });
    });
    app.get('/api/auth/google/callback', (_req, res) => {
        res.status(501).json({ error: { message: 'Google OAuth is not configured' } });
    });
}
// Serve static uploaded files (resumes, attachments)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// API routes
app.use('/api', routes_1.default);
// Error handling middleware (must be last)
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = config_1.config.port;
const server = app.listen(PORT, () => {
    logger_1.logger.info(`Server is running on http://localhost:${PORT}`);
    logger_1.logger.info(`Environment: ${config_1.config.nodeEnv}`);
    logger_1.logger.info(`Frontend URL: ${config_1.config.frontend.url}`);
    // Log email service status (check matches emailService.ts logic)
    const hasEmailUser = config_1.config.email.user && config_1.config.email.user.trim() !== '';
    const hasEmailPass = config_1.config.email.pass && config_1.config.email.pass.trim() !== '';
    if (hasEmailUser && hasEmailPass) {
        logger_1.logger.info('Email service: Configured ✓');
        logger_1.logger.debug(`Email host: ${config_1.config.email.host}:${config_1.config.email.port}`);
        logger_1.logger.debug(`Email from: ${config_1.config.email.from}`);
    }
    else {
        logger_1.logger.warn('Email service: Not configured (password reset links will appear in console)');
        logger_1.logger.warn('To enable email service, add EMAIL_USER and EMAIL_PASS to backend/.env file');
        if (process.env.NODE_ENV === 'development') {
            logger_1.logger.info(`   EMAIL_USER from env: ${process.env.EMAIL_USER ? `"${process.env.EMAIL_USER}"` : 'NOT SET'}`);
            logger_1.logger.info(`   EMAIL_PASS from env: ${process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET'}`);
            logger_1.logger.info(`   config.email.user: ${config_1.config.email.user ? `"${config_1.config.email.user}"` : 'empty'}`);
            logger_1.logger.info(`   config.email.pass: ${config_1.config.email.pass ? 'SET (hidden)' : 'empty'}`);
        }
    }
    // Start Keep-Alive Service to keep Render instance awake
    (0, keepAliveService_1.startKeepAlive)(PORT);
});
// Graceful shutdown handler for production
const gracefulShutdown = (signal) => {
    logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
    (0, keepAliveService_1.stopKeepAlive)();
    server.close(() => {
        logger_1.logger.info('HTTP server closed.');
        // Close database connection
        mongoose_1.default.connection.close().then(() => {
            logger_1.logger.info('MongoDB connection closed.');
            process.exit(0);
        }).catch((error) => {
            logger_1.logger.error('Error closing MongoDB connection:', error);
            process.exit(1);
        });
    });
    // Force close after 10 seconds
    setTimeout(() => {
        logger_1.logger.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 10000);
};
// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('UNHANDLED REJECTION REASON:', reason);
    if (reason instanceof Error && reason.stack) {
        console.log('UNHANDLED REJECTION STACK:', reason.stack);
    }
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in development, but log the error
    if (process.env.NODE_ENV === 'production') {
        gracefulShutdown('unhandledRejection');
    }
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log('UNCAUGHT EXCEPTION ERROR:', error);
    if (error && error.stack) {
        console.log('UNCAUGHT EXCEPTION STACK:', error.stack);
    }
    logger_1.logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
exports.default = app;
//# sourceMappingURL=index.js.map