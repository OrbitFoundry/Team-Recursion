"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Company_1 = __importDefault(require("../models/Company"));
const Resource_1 = __importDefault(require("../models/Resource"));
const router = (0, express_1.Router)();
// All admin routes require authentication + admin check (which is currently a pass-through)
router.use(auth_1.authenticate, auth_1.adminOnly);
// ─────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────
// GET /api/admin/students — list all students with application count and optional search
router.get('/students', async (req, res) => {
    try {
        const { search } = req.query;
        const matchStage = {
            $or: [
                { role: 'student' },
                { role: { $exists: false } },
                { role: null },
            ],
        };
        if (search) {
            matchStage.$and = [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ],
                },
            ];
        }
        const students = await User_1.default.aggregate([
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch students' } });
    }
});
// GET /api/admin/students/:id — view a specific student's details and their applications
router.get('/students/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid student ID format' } });
        }
        const studentId = new mongoose_1.default.Types.ObjectId(req.params.id);
        const student = await User_1.default.findById(studentId).select('name email role resumeLink techStacks');
        if (!student) {
            return res.status(404).json({ error: { message: 'Student not found' } });
        }
        const companies = await Company_1.default.find({ userId: studentId })
            .sort({ applicationDate: -1 })
            .lean();
        return res.status(200).json({ student, companies });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch student details' } });
    }
});
// ─────────────────────────────────────────
// COMPANIES (admin global)
// ─────────────────────────────────────────
// GET /api/admin/companies — ALL companies across ALL students
router.get('/companies', async (req, res) => {
    try {
        const { search, status, sort = 'desc', studentSearch } = req.query;
        const matchStage = {};
        if (search) {
            matchStage.companyName = { $regex: search, $options: 'i' };
        }
        if (status) {
            matchStage.status = status;
        }
        const sortOrder = sort === 'asc' ? 1 : -1;
        const companies = await Company_1.default.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'student',
                },
            },
            { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
            // Filter by student name/email if requested
            ...(studentSearch
                ? [
                    {
                        $match: {
                            $or: [
                                { 'student.name': { $regex: studentSearch, $options: 'i' } },
                                { 'student.email': { $regex: studentSearch, $options: 'i' } },
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch companies' } });
    }
});
// ─────────────────────────────────────────
// RESOURCES (admin global)
// ─────────────────────────────────────────
// GET /api/admin/resources — ALL resources across all students with optional category filter
router.get('/resources', async (req, res) => {
    try {
        const { category } = req.query;
        const matchStage = {};
        if (category) {
            matchStage.category = category;
        }
        const resources = await Resource_1.default.aggregate([
            ...(category ? [{ $match: matchStage }] : []),
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch resources' } });
    }
});
// DELETE /api/admin/resources/:id — moderate/remove any resource
router.delete('/resources/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid resource ID format' } });
        }
        const resource = await Resource_1.default.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found' } });
        }
        return res.status(200).json({ message: 'Resource deleted successfully' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to delete resource' } });
    }
});
// ─────────────────────────────────────────
// ADMIN DASHBOARD STATS
// ─────────────────────────────────────────
// GET /api/admin/dashboard/stats — global aggregated stats
router.get('/dashboard/stats', async (_req, res) => {
    try {
        // Run all aggregations in parallel
        const [totalStudents, globalStatusBreakdown, topCompanies, recentActivity, recentResources,] = await Promise.all([
            // Total registered students
            User_1.default.countDocuments({
                $or: [
                    { role: 'student' },
                    { role: { $exists: false } },
                    { role: null },
                ],
            }),
            // Global status breakdown
            Company_1.default.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            // Top 5 most-applied companies
            Company_1.default.aggregate([
                { $group: { _id: '$companyName', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $project: { companyName: '$_id', count: 1, _id: 0 } },
            ]),
            // Recent 10 applications across all students (with student info)
            Company_1.default.aggregate([
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
                { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
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
            Resource_1.default.aggregate([
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
                { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
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
        const statusBreakdown = {
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
            if (item._id === 'Selected')
                totalOffers += item.count;
            if (item._id === 'Rejected')
                totalRejections += item.count;
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
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch admin stats' } });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map