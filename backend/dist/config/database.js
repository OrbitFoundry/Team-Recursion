"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    const mongoUri = index_1.config.database.uri;
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    logger_1.logger.info('Connecting to MongoDB...');
    logger_1.logger.debug(`MongoDB URI: ${maskedUri}`);
    let connected = false;
    // 1. Try primary configured URI
    try {
        await mongoose_1.default.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        connected = true;
        logger_1.logger.info('MongoDB connected successfully to primary database URI');
    }
    catch (error) {
        logger_1.logger.warn('Primary MongoDB URI connection failed.');
    }
    // 2. In development mode, fallback if primary fails
    if (!connected && index_1.config.nodeEnv === 'development') {
        try {
            logger_1.logger.info('Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/auth-app)...');
            await mongoose_1.default.connect('mongodb://127.0.0.1:27017/auth-app', { serverSelectionTimeoutMS: 2000 });
            connected = true;
            logger_1.logger.info('Connected to Local MongoDB successfully!');
        }
        catch {
            // Local Mongo not running, fallback to MongoMemoryServer
        }
        if (!connected) {
            try {
                logger_1.logger.info('Attempting fallback to in-memory MongoDB server for local development...');
                const { MongoMemoryServer } = await Promise.resolve().then(() => __importStar(require('mongodb-memory-server')));
                const mongoServer = await MongoMemoryServer.create();
                const inMemoryUri = mongoServer.getUri();
                await mongoose_1.default.connect(inMemoryUri);
                connected = true;
                logger_1.logger.info('Connected to In-Memory MongoDB successfully! (Local Staging Environment)');
            }
            catch (fallbackError) {
                logger_1.logger.error('In-Memory MongoDB fallback failed:', fallbackError);
            }
        }
    }
    if (!connected) {
        logger_1.logger.error('Failed to establish MongoDB connection.');
        process.exit(1);
    }
    // Attach connection health listeners after successful initial connection
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.logger.warn('MongoDB disconnected');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.logger.error('MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('reconnected', () => {
        logger_1.logger.info('MongoDB reconnected');
    });
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map