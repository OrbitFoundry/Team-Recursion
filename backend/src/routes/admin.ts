import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticate, adminOnly } from '../middleware/auth';
import User from '../models/User';
import Company from '../models/Company';
import Resource from '../models/Resource';

const router = Router();

// All admin routes require authentication + admin check (which is currently a pass-through)
router.use(authenticate, adminOnly);

// ─────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────

// GET /api/admin/students — list all students with application count and optional search
router.get('/students', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const matchStage: any = { role: 'student' };

    if (search) {
      matchStage.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const students = await User.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: 'userId',
          as: 'companies',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          applicationCount: { $size: '$companies' },
          offerCount: {
            $size: {
              $filter: {
                input: '$companies',
                as: 'c',
                cond: { $eq: ['$$c.status', 'Selected'] },
              },
            },
          },
          lastActivity: { $max: '$companies.createdAt' },
        },
      },
      { $sort: { applicationCount: -1 } },
    ]);

    return res.status(200).json({ students });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch students' } });
  }
});

// GET /api/admin/students/:id — view a specific student's details and their applications
router.get('/students/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid student ID format' } });
    }

    const studentId = new mongoose.Types.ObjectId(req.params.id);
    const student = await User.findById(studentId).select('name email role resumeLink techStacks');

    if (!student) {
      return res.status(404).json({ error: { message: 'Student not found' } });
    }

    const companies = await Company.find({ userId: studentId })
      .sort({ applicationDate: -1 })
      .lean();

    return res.status(200).json({ student, companies });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch student details' } });
  }
});

// ─────────────────────────────────────────
// COMPANIES (admin global)
// ─────────────────────────────────────────

// GET /api/admin/companies — ALL companies across ALL students
router.get('/companies', async (req: Request, res: Response) => {
  try {
    const { search, status, sort = 'desc', studentSearch } = req.query;
    const matchStage: any = {};

    if (search) {
      matchStage.companyName = { $regex: search as string, $options: 'i' };
    }

    if (status) {
      matchStage.status = status;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;

    const companies = await Company.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      // Filter by student name/email if requested
      ...(studentSearch
        ? [
            {
              $match: {
                $or: [
                  { 'student.name': { $regex: studentSearch as string, $options: 'i' } },
                  { 'student.email': { $regex: studentSearch as string, $options: 'i' } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          companyName: 1,
          role: 1,
          applicationDate: 1,
          status: 1,
          notes: 1,
          createdAt: 1,
          'student.name': 1,
          'student.email': 1,
          'student._id': 1,
        },
      },
      { $sort: { applicationDate: sortOrder } },
    ]);

    return res.status(200).json({ companies });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch companies' } });
  }
});

// ─────────────────────────────────────────
// RESOURCES (admin global)
// ─────────────────────────────────────────

// GET /api/admin/resources — ALL resources across all students with optional category filter
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const matchStage: any = {};
    if (category) {
      matchStage.category = category;
    }

    const resources = await Resource.aggregate([
      ...(category ? [{ $match: matchStage }] : []),
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $project: {
          title: 1,
          category: 1,
          link: 1,
          createdAt: 1,
          'student.name': 1,
          'student.email': 1,
          'student._id': 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({ resources });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch resources' } });
  }
});

// DELETE /api/admin/resources/:id — moderate/remove any resource
router.delete('/resources/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid resource ID format' } });
    }

    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    return res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to delete resource' } });
  }
});

// ─────────────────────────────────────────
// ADMIN DASHBOARD STATS
// ─────────────────────────────────────────

// GET /api/admin/dashboard/stats — global aggregated stats
router.get('/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    // Run all aggregations in parallel
    const [
      totalStudents,
      globalStatusBreakdown,
      topCompanies,
      recentActivity,
      recentResources,
    ] = await Promise.all([
      // Total registered students
      User.countDocuments({ role: 'student' }),
      // Global status breakdown
      Company.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Top 5 most-applied companies
      Company.aggregate([
        { $group: { _id: '$companyName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { companyName: '$_id', count: 1, _id: 0 } },
      ]),
      // Recent 10 applications across all students (with student info)
      Company.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'student',
          },
        },
        { $unwind: '$student' },
        {
          $project: {
            companyName: 1,
            role: 1,
            status: 1,
            applicationDate: 1,
            createdAt: 1,
            'student.name': 1,
            'student.email': 1,
          },
        },
      ]),
      // Recent 10 resources (for moderation panel)
      Resource.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'student',
          },
        },
        { $unwind: '$student' },
        {
          $project: {
            title: 1,
            category: 1,
            link: 1,
            createdAt: 1,
            'student.name': 1,
            'student.email': 1,
          },
        },
      ]),
    ]);

    // Build status map
    const statusBreakdown: Record<string, number> = {
      'Applied': 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      'Selected': 0,
      'Rejected': 0,
    };

    let totalApplications = 0;
    let totalOffers = 0;
    let totalRejections = 0;

    for (const item of globalStatusBreakdown) {
      if (item._id && item._id in statusBreakdown) {
        statusBreakdown[item._id] = item.count;
      }
      totalApplications += item.count;
      if (item._id === 'Selected') totalOffers += item.count;
      if (item._id === 'Rejected') totalRejections += item.count;
    }

    return res.status(200).json({
      totalStudents,
      totalApplications,
      totalOffers,
      totalRejections,
      statusBreakdown,
      topCompanies,
      recentActivity,
      recentResources,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch admin stats' } });
  }
});

export default router;
