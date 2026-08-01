import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticate, AuthRequest } from '../middleware/auth';
import Company from '../models/Company';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/dashboard/stats — student's own stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user!.userId);

    // Aggregate stats for this user using a single pipeline
    const [statsResult] = await Company.aggregate([
      { $match: { userId } },
      {
        $facet: {
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          recentApplications: [
            { $sort: { applicationDate: -1 } },
            { $limit: 5 },
            {
              $project: {
                companyName: 1,
                role: 1,
                status: 1,
                applicationDate: 1,
                notes: 1,
              },
            },
          ],
        },
      },
    ]);

    // Build status breakdown map
    const statusBreakdown: Record<string, number> = {
      'Applied': 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      'Selected': 0,
      'Rejected': 0,
    };

    let totalApplied = 0;
    let totalOffers = 0;
    let totalRejected = 0;

    for (const item of (statsResult?.statusCounts || [])) {
      statusBreakdown[item._id] = item.count;
      totalApplied += item.count;
      if (item._id === 'Selected') totalOffers += item.count;
      if (item._id === 'Rejected') totalRejected += item.count;
    }

    const totalActive = totalApplied - totalOffers - totalRejected;
    const successRate = totalApplied > 0 ? Math.round((totalOffers / totalApplied) * 100) : 0;

    return res.status(200).json({
      totalApplied,
      totalActive: Math.max(totalActive, 0),
      totalOffers,
      totalRejected,
      successRate,
      statusBreakdown,
      recentApplications: statsResult?.recentApplications || [],
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch dashboard stats' } });
  }
});

// GET /api/dashboard/admin-stats — global system metrics for admin
router.get('/admin-stats', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (authReq.user?.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied. Admin role required.' } });
    }

    const [statsResult] = await Company.aggregate([
      {
        $facet: {
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          recentApplications: [
            { $sort: { applicationDate: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'student',
              },
            },
            { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                companyName: 1,
                role: 1,
                status: 1,
                applicationDate: 1,
                notes: 1,
                studentName: '$student.name',
                studentEmail: '$student.email',
              },
            },
          ],
        },
      },
    ]);

    const User = mongoose.model('User');
    const totalStudents = await User.countDocuments({ role: 'student' });

    const statusBreakdown: Record<string, number> = {
      'Applied': 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      'Selected': 0,
      'Rejected': 0,
    };

    let totalApplied = 0;
    let totalOffers = 0;
    let totalRejected = 0;

    for (const item of (statsResult?.statusCounts || [])) {
      statusBreakdown[item._id] = item.count;
      totalApplied += item.count;
      if (item._id === 'Selected') totalOffers += item.count;
      if (item._id === 'Rejected') totalRejected += item.count;
    }

    const totalActive = totalApplied - totalOffers - totalRejected;
    const successRate = totalApplied > 0 ? Math.round((totalOffers / totalApplied) * 100) : 0;

    return res.status(200).json({
      totalStudents,
      totalApplied,
      totalActive: Math.max(totalActive, 0),
      totalOffers,
      totalRejected,
      successRate,
      statusBreakdown,
      recentApplications: statsResult?.recentApplications || [],
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch admin stats' } });
  }
});

export default router;
