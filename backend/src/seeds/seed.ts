/**
 * Seed script — creates admin + sample students/companies/resources for demo.
 * Run with: cd backend && npx tsx src/seeds/seed.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import User from '../models/User';
import Company from '../models/Company';
import Resource from '../models/Resource';

const ADMIN = {
  name: 'Admin User',
  email: 'admin@placement.dev',
  password: 'Admin@12345',
  role: 'admin' as const,
};

const STUDENTS = [
  { name: 'Ayush Sharma', email: 'ayush@student.dev', password: 'Student@123' },
  { name: 'Bhumit Patel', email: 'bhumit@student.dev', password: 'Student@123' },
  { name: 'Gaurav Singh', email: 'gaurav@student.dev', password: 'Student@123' },
];

const STATUS_LIST = [
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected',
] as const;

const COMPANIES_DATA = [
  { companyName: 'Google', role: 'Software Engineer', companyLink: 'https://careers.google.com/' },
  { companyName: 'Microsoft', role: 'SDE-1', companyLink: 'https://careers.microsoft.com/' },
  { companyName: 'Amazon', role: 'SDE-2', companyLink: 'https://amazon.jobs/' },
  { companyName: 'Flipkart', role: 'Backend Developer', companyLink: 'https://flipkartcareers.com/' },
  { companyName: 'Infosys', role: 'Systems Engineer', companyLink: 'https://infosys.com/careers' },
  { companyName: 'TCS', role: 'Assistant System Engineer', companyLink: 'https://tcs.com/careers' },
  { companyName: 'Wipro', role: 'Project Engineer', companyLink: 'https://careers.wipro.com/' },
  { companyName: 'Juspay', role: 'Software Developer', companyLink: 'https://juspay.in/careers' },
  { companyName: 'Razorpay', role: 'Backend Engineer', companyLink: 'https://razorpay.com/jobs/' },
  { companyName: 'CRED', role: 'SDE-1', companyLink: 'https://careers.cred.club/' },
];

const RESOURCES_DATA = [
  { title: 'Striver A-Z DSA Sheet', category: 'DSA', link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
  { title: 'IndiaBix Aptitude Questions', category: 'Aptitude', link: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
  { title: 'Resume Tips — Overleaf', category: 'Resume', link: 'https://www.overleaf.com/gallery/tagged/cv' },
  { title: 'GeeksForGeeks Interview Experiences', category: 'Interview Experience', link: 'https://www.geeksforgeeks.org/company-interview-corner/' },
  { title: 'DBMS Notes — Gate Smashers', category: 'Core Subjects', link: 'https://www.youtube.com/playlist?list=PLxCzCOWd3aioz9LCce4m4JpSdCYIuovj3' },
  { title: 'NeetCode 150', category: 'DSA', link: 'https://neetcode.io/practice' },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(config.database.uri);
  console.log('✅ Connected');

  // Clear existing seed data
  await User.deleteMany({ email: { $in: [ADMIN.email, ...STUDENTS.map(s => s.email)] } });

  const salt = await bcrypt.genSalt(10);

  // Create admin
  const adminPassword = await bcrypt.hash(ADMIN.password, salt);
  const admin = await User.create({
    name: ADMIN.name,
    email: ADMIN.email,
    password: adminPassword,
    role: ADMIN.role,
    isEmailVerified: true,
  });
  console.log(`👑 Admin created: ${admin.email}`);

  // Create students
  const createdStudents = [];
  for (const s of STUDENTS) {
    const hashed = await bcrypt.hash(s.password, salt);
    const student = await User.create({
      name: s.name,
      email: s.email,
      password: hashed,
      role: 'student',
      isEmailVerified: true,
    });
    createdStudents.push(student);
    console.log(`👤 Student created: ${student.email}`);
  }

  // Wipe old company & resource data for these students
  const studentIds = createdStudents.map(s => s._id);
  await Company.deleteMany({ userId: { $in: studentIds } });
  await Resource.deleteMany({ userId: { $in: studentIds } });

  // Seed companies (distribute round-robin across students)
  for (let i = 0; i < COMPANIES_DATA.length; i++) {
    const student = createdStudents[i % createdStudents.length];
    const status = STATUS_LIST[Math.floor(Math.random() * STATUS_LIST.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const applicationDate = new Date();
    applicationDate.setDate(applicationDate.getDate() - daysAgo);

    await Company.create({
      userId: student._id,
      ...COMPANIES_DATA[i],
      applicationDate,
      status,
      notes: `Applied via ${i % 2 === 0 ? 'LinkedIn' : 'company portal'}`,
    });
    console.log(`🏢 Company added: ${COMPANIES_DATA[i].companyName} for ${student.name}`);
  }

  // Seed resources (distribute across students)
  for (let i = 0; i < RESOURCES_DATA.length; i++) {
    const student = createdStudents[i % createdStudents.length];
    await Resource.create({
      userId: student._id,
      ...RESOURCES_DATA[i],
    });
    console.log(`📚 Resource added: ${RESOURCES_DATA[i].title}`);
  }

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────');
  console.log('Admin login:');
  console.log(`  Email:    ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);
  console.log('\nStudent login (any of these):');
  for (const s of STUDENTS) {
    console.log(`  ${s.email} / ${s.password}`);
  }
  console.log('─────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
