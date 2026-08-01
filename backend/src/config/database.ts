import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = config.database.uri;
  const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

  logger.info('Connecting to MongoDB...');
  logger.debug(`MongoDB URI: ${maskedUri}`);

  let connected = false;

  // 1. Try primary configured URI
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    connected = true;
    logger.info('MongoDB connected successfully to primary database URI');
  } catch (error: unknown) {
    logger.warn('Primary MongoDB URI connection failed.');
  }

  // 2. In development mode, fallback if primary fails
  if (!connected && config.nodeEnv === 'development') {
    try {
      logger.info('Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/auth-app)...');
      await mongoose.connect('mongodb://127.0.0.1:27017/auth-app', { serverSelectionTimeoutMS: 2000 });
      connected = true;
      logger.info('Connected to Local MongoDB successfully!');
    } catch {
      // Local Mongo not running, fallback to MongoMemoryServer
    }

    if (!connected) {
      try {
        logger.info('Attempting fallback to in-memory MongoDB server for local development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri);
        connected = true;
        logger.info('Connected to In-Memory MongoDB successfully! (Local Staging Environment)');
      } catch (fallbackError) {
        logger.error('In-Memory MongoDB fallback failed:', fallbackError);
      }
    }
  }

  if (!connected) {
    logger.error('Failed to establish MongoDB connection.');
    process.exit(1);
  }

  // Attach connection health listeners after successful initial connection
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
};

