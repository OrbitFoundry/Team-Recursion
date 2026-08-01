import dotenv from 'dotenv';
import path from 'path';
import { existsSync, readFileSync } from 'node:fs';

// Helper function to find backend directory
// Checks if current directory or parent directory contains backend/package.json
const findBackendDirectory = (): string => {
  const cwd = process.cwd();
  
  // Check if we're already in the backend directory
  const currentPackageJson = path.resolve(cwd, 'package.json');
  if (existsSync(currentPackageJson)) {
    try {
      const packageContent = JSON.parse(readFileSync(currentPackageJson, 'utf-8'));
      if (packageContent.name === 'backend') {
        return cwd;
      }
    } catch {
      // If we can't read/parse package.json, continue checking
    }
  }
  
  // Check parent directory for backend/package.json
  const parentBackendPackageJson = path.resolve(cwd, '..', 'backend', 'package.json');
  if (existsSync(parentBackendPackageJson)) {
    try {
      const packageContent = JSON.parse(readFileSync(parentBackendPackageJson, 'utf-8'));
      if (packageContent.name === 'backend') {
        return path.resolve(cwd, '..', 'backend');
      }
    } catch {
      // If we can't read/parse package.json, continue
    }
  }
  
  // Fallback: assume we're in backend directory if package.json exists
  if (existsSync(currentPackageJson)) {
    return cwd;
  }
  
  // Last resort: assume backend is in current directory
  return cwd;
};

// Determine backend directory and .env file path
const backendDir = findBackendDirectory();
const envFilePath = path.resolve(backendDir, '.env');

let envLoaded = false;
let loadError: Error | null = null;
let loadedEnvPath: string | null = null;

const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function for early logging (before logger is available)
const earlyLog = (message: string, isError = false) => {
  if (isError || isDevelopment) {
    const timestamp = new Date().toISOString();
    const level = isError ? 'ERROR' : 'INFO';
    const method = isError ? console.error : console.log;
    method(`[${timestamp}] [${level}] ${message}`);
  }
};

// Load environment variables from backend/.env only
if (existsSync(envFilePath)) {
  const result = dotenv.config({ 
    path: envFilePath, 
    override: true,
    debug: false // Disable dotenv debug output
  });
  if (!result.error) {
    envLoaded = true;
    loadedEnvPath = envFilePath;
  } else {
    loadError = result.error;
  }
} else {
  // Don't try fallback - we want to be explicit about .env location
  if (isDevelopment) {
    earlyLog(`⚠️  .env file not found at: ${envFilePath}`, false);
  }
}

// Only log .env file errors in development (in production, env vars come from Render/cloud provider)
if (!envLoaded && loadError && isDevelopment) {
  earlyLog(`Error loading .env file: ${loadError.message}`, true);
}

// Required environment variables
const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

// Check for required environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  earlyLog('', false);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('❌ MISSING REQUIRED ENVIRONMENT VARIABLES', true);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('', false);
  earlyLog(`Missing variables: ${missingVars.join(', ')}`, true);
  earlyLog('', false);
  
  // Check if env.example exists in backend directory
  const envExamplePath = path.resolve(backendDir, 'env.example');
  const envPath = path.resolve(backendDir, '.env');
  
  if (existsSync(envExamplePath)) {
    earlyLog('📋 SETUP INSTRUCTIONS:', false);
    earlyLog('', false);
    earlyLog('OPTION 1 - Use the automated setup script (Recommended):', false);
    earlyLog('   npm run setup:env', false);
    earlyLog('', false);
    earlyLog('OPTION 2 - Manual setup:', false);
    earlyLog('   1. Copy the example environment file:', false);
    earlyLog(`      cp env.example .env`, false);
    earlyLog(`      OR on Windows: copy env.example .env`, false);
    earlyLog('', false);
    earlyLog('   2. Edit the .env file and fill in the required values:', false);
    earlyLog(`      - MONGODB_URI: Your MongoDB connection string`, false);
    earlyLog(`      - JWT_SECRET: Generate with: openssl rand -base64 32`, false);
    earlyLog(`      - FRONTEND_URL: Your frontend URL (e.g., http://localhost:3000)`, false);
    earlyLog('', false);
    earlyLog(`   3. Expected .env file location: ${envPath}`, false);
  } else {
    earlyLog('📋 SETUP INSTRUCTIONS:', false);
    earlyLog('', false);
    earlyLog('1. Create a .env file in the backend/ directory', false);
    earlyLog('', false);
    earlyLog('2. Add the following required environment variables:', false);
    earlyLog('', false);
    earlyLog('   MONGODB_URI=mongodb://localhost:27017/auth-app', false);
    earlyLog('   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters', false);
    earlyLog('   FRONTEND_URL=http://localhost:3000', false);
    earlyLog('', false);
    earlyLog('   To generate a secure JWT_SECRET, run:', false);
    earlyLog('   openssl rand -base64 32', false);
    earlyLog('', false);
    earlyLog(`3. Expected .env file location: ${envPath}`, false);
  }
  
  earlyLog('', false);
  earlyLog('📚 For more detailed setup instructions, see:', false);
  earlyLog('   - SETUP_GUIDE.md in the project root', false);
  earlyLog('   - backend/env.example (if available)', false);
  earlyLog('', false);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('', false);
  process.exit(1);
}

// Validate JWT_SECRET length (security requirement)
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  earlyLog('', false);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('❌ INVALID JWT_SECRET', true);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('', false);
  earlyLog(`JWT_SECRET must be at least 32 characters long (current: ${process.env.JWT_SECRET.length}).`, true);
  earlyLog('', false);
  earlyLog('🔐 To generate a secure JWT_SECRET, run one of these commands:', false);
  earlyLog('   openssl rand -base64 32', false);
  earlyLog('   OR on Windows PowerShell:', false);
  earlyLog('   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))', false);
  earlyLog('', false);
  earlyLog('Then update your .env file with the generated value.', false);
  earlyLog('', false);
  earlyLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', true);
  earlyLog('', false);
  process.exit(1);
}

// Log environment loading status (development only)
if (isDevelopment) {
  const mongoUri = process.env.MONGODB_URI!;
  const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  earlyLog(`Environment loaded - MongoDB: ${maskedUri}`);
  if (loadedEnvPath) {
    earlyLog(`Loaded .env from: ${loadedEnvPath}`);
  }
}

// Validate port number
const port = parseInt(process.env.PORT || '5000', 10);
if (isNaN(port) || port < 1 || port > 65535) {
  earlyLog(`Invalid PORT value: ${process.env.PORT}. Using default: 5000`, true);
}

// Validate JWT expires in format
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const expiresInRegex = /^\d+[smhd]$/;
if (!expiresInRegex.test(jwtExpiresIn)) {
  earlyLog(`Invalid JWT_EXPIRES_IN format: ${jwtExpiresIn}. Using default: 7d`, true);
}

// Validate email port
const emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
if (isNaN(emailPort) || emailPort < 1 || emailPort > 65535) {
  earlyLog(`Invalid EMAIL_PORT value: ${process.env.EMAIL_PORT}. Using default: 587`, true);
}

export const config = {
  port: isNaN(port) || port < 1 || port > 65535 ? 5000 : port,
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  
  database: {
    uri: process.env.MONGODB_URI!,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: expiresInRegex.test(jwtExpiresIn) ? jwtExpiresIn : '7d',
  },
  
  google: {
    clientId: (process.env.GOOGLE_CLIENT_ID || '').trim(),
    clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
    callbackURL: (process.env.GOOGLE_CALLBACK_URL || `http://localhost:${port || 5000}/api/auth/google/callback`).trim(),
  },
  
  email: {
    host: (process.env.EMAIL_HOST || 'smtp.gmail.com').trim(),
    port: isNaN(emailPort) || emailPort < 1 || emailPort > 65535 ? 587 : emailPort,
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').trim(),
    from: (process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@yourapp.com').trim(),
  },
  
  frontend: {
    url: process.env.FRONTEND_URL!.trim(),
  },
  
  session: {
    secret: (process.env.SESSION_SECRET || process.env.JWT_SECRET!).trim(),
  },
};
