import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './index';
import { logger } from '../utils/logger';
import User from '../models/User';
import Company from '../models/Company';
import Resource from '../models/Resource';

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

  // Auto-seed admin user and sample student data if not exists
  try {
    const adminEmail = 'admin@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    const salt = await bcrypt.genSalt(10);
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin@1234', salt);
      admin = await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
      });
      logger.info(`Auto-created Admin account: ${adminEmail}`);
    }

    const studentCount = await User.countDocuments({ role: 'student' });
    if (studentCount === 0) {
      logger.info('No students found in DB. Commencing auto-seeding of sample students and applications...');
      
      const pass = await bcrypt.hash('student@1234', salt);
      
      // Create Students
      const student1 = await User.create({
        name: 'Ayush Sharma',
        email: 'ayush@gmail.com',
        password: pass,
        role: 'student',
        isEmailVerified: true,
        techStacks: ['React', 'TypeScript', 'Node.js', 'Next.js'],
      });
      
      const student2 = await User.create({
        name: 'Bhumit Patel',
        email: 'bhumit@gmail.com',
        password: pass,
        role: 'student',
        isEmailVerified: true,
        techStacks: ['AWS', 'Java', 'Python', 'Docker'],
      });
      
      const student3 = await User.create({
        name: 'Gaurav Khandelwal',
        email: 'gaurav@gmail.com',
        password: pass,
        role: 'student',
        isEmailVerified: true,
        techStacks: ['Go', 'Rust', 'Kubernetes', 'PostgreSQL'],
      });

      logger.info('Sample students created successfully.');

      // Seed Company Applications
      await Company.create([
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

      logger.info('Sample company applications seeded.');

      // Seed Resources
      await Resource.create([
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

      logger.info('Sample study resources seeded.');
    }
  } catch (err) {
    logger.error('Error auto-seeding database:', err);
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

