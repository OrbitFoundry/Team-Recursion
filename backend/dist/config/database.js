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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
const User_1 = __importDefault(require("../models/User"));
const Company_1 = __importDefault(require("../models/Company"));
const Resource_1 = __importDefault(require("../models/Resource"));
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
    // Auto-seed admin user and sample student data if not exists
    try {
        const adminEmail = 'admin@gmail.com';
        let admin = await User_1.default.findOne({ email: adminEmail });
        const salt = await bcryptjs_1.default.genSalt(10);
        if (!admin) {
            const hashedPassword = await bcryptjs_1.default.hash('admin@1234', salt);
            admin = await User_1.default.create({
                name: 'Administrator',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isEmailVerified: true,
            });
            logger_1.logger.info(`Auto-created Admin account: ${adminEmail}`);
        }
        const studentCount = await User_1.default.countDocuments({ role: 'student' });
        if (studentCount === 0) {
            logger_1.logger.info('No students found in DB. Commencing auto-seeding of sample students and applications...');
            const pass = await bcryptjs_1.default.hash('student@1234', salt);
            // Create Students
            const student1 = await User_1.default.create({
                name: 'Ayush Sharma',
                email: 'ayush@gmail.com',
                password: pass,
                role: 'student',
                isEmailVerified: true,
                techStacks: ['React', 'TypeScript', 'Node.js', 'Next.js'],
            });
            const student2 = await User_1.default.create({
                name: 'Bhumit Patel',
                email: 'bhumit@gmail.com',
                password: pass,
                role: 'student',
                isEmailVerified: true,
                techStacks: ['AWS', 'Java', 'Python', 'Docker'],
            });
            const student3 = await User_1.default.create({
                name: 'Gaurav Khandelwal',
                email: 'gaurav@gmail.com',
                password: pass,
                role: 'student',
                isEmailVerified: true,
                techStacks: ['Go', 'Rust', 'Kubernetes', 'PostgreSQL'],
            });
            logger_1.logger.info('Sample students created successfully.');
            // Seed Company Applications
            await Company_1.default.create([
                {
                    userId: student1._id,
                    companyName: 'Google',
                    role: 'Software Engineer Intern',
                    applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    status: 'Selected',
                    companyLink: 'https://careers.google.com/',
                    techStacks: ['React', 'TypeScript', 'Go'],
                    notes: 'Matched with standard referral. 3 rounds of technical coding interview.',
                },
                {
                    userId: student1._id,
                    companyName: 'Microsoft',
                    role: 'SDE-1',
                    applicationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                    status: 'Technical Interview',
                    companyLink: 'https://careers.microsoft.com/',
                    techStacks: ['C#', 'SQL', 'TypeScript'],
                    notes: 'Completed OA (85/100). Scheduled for virtual on-sites.',
                },
                {
                    userId: student2._id,
                    companyName: 'Amazon',
                    role: 'Cloud Architect Intern',
                    applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                    status: 'HR Interview',
                    companyLink: 'https://amazon.jobs/',
                    techStacks: ['AWS', 'Java', 'Python'],
                    notes: 'Completed system design interview. Waiting for feedback.',
                },
                {
                    userId: student2._id,
                    companyName: 'Netflix',
                    role: 'Frontend UI Engineer',
                    applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    status: 'Applied',
                    companyLink: 'https://jobs.netflix.com/',
                    techStacks: ['React', 'Tailwind'],
                    notes: 'Resume screening stage.',
                },
                {
                    userId: student3._id,
                    companyName: 'Apple',
                    role: 'Systems Software Engineer',
                    applicationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
                    status: 'Rejected',
                    companyLink: 'https://apple.com/careers/',
                    techStacks: ['C++', 'Rust'],
                    notes: 'Rejected after round 2 technical panel.',
                },
                {
                    userId: student3._id,
                    companyName: 'Razorpay',
                    role: 'Backend Platform Engineer',
                    applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    status: 'Online Assessment',
                    companyLink: 'https://razorpay.com/jobs/',
                    techStacks: ['Node.js', 'Go', 'Docker'],
                    notes: 'OA active. Need to complete by Sunday.',
                }
            ]);
            logger_1.logger.info('Sample company applications seeded.');
            // Seed Resources
            await Resource_1.default.create([
                {
                    userId: student1._id,
                    title: 'Striver A-Z DSA Sheet',
                    category: 'DSA',
                    link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
                },
                {
                    userId: student2._id,
                    title: 'DBMS Revision Notes — Gate Smashers',
                    category: 'Core Subjects',
                    link: 'https://www.youtube.com/playlist?list=PLxCzCOWd3aioz9LCce4m4JpSdCYIuovj3',
                },
                {
                    userId: student3._id,
                    title: 'System Design Interview Guide',
                    category: 'Interview Experience',
                    link: 'https://github.com/donnemartin/system-design-primer',
                }
            ]);
            logger_1.logger.info('Sample study resources seeded.');
        }
    }
    catch (err) {
        logger_1.logger.error('Error auto-seeding database:', err);
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