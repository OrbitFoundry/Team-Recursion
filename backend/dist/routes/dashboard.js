"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const Company_1 = __importDefault(require("../models/Company"));
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// GET /api/dashboard/stats — student's own stats
router.get('/stats', async (req, res) => {
    try {
        const authReq = req;
        const userId = new mongoose_1.default.Types.ObjectId(authReq.user.userId);
        // Aggregate stats for this user using a single pipeline
        const [statsResult] = await Company_1.default.aggregate([
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
        const statusBreakdown = {
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
            if (item._id === 'Selected')
                totalOffers += item.count;
            if (item._id === 'Rejected')
                totalRejected += item.count;
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch dashboard stats' } });
    }
});
// GET /api/dashboard/admin-stats — global system metrics for admin
router.get('/admin-stats', async (_req, res) => {
    try {
        const [statsResult] = await Company_1.default.aggregate([
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
        const User = mongoose_1.default.model('User');
        const totalStudents = await User.countDocuments({});
        const statusBreakdown = {
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
            if (item._id === 'Selected')
                totalOffers += item.count;
            if (item._id === 'Rejected')
                totalRejected += item.count;
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch admin stats' } });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map