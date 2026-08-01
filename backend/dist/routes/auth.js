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
const express_1 = require("express");
const authService_1 = require("../services/authService");
const authValidator_1 = require("../validators/authValidator");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const upload_1 = require("../middleware/upload");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Register
router.post('/register', rateLimiter_1.authLimiter, async (req, res) => {
    try {
        const validation = (0, authValidator_1.validateRegister)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    errors: validation.errors,
                },
            });
        }
        const result = await (0, authService_1.registerUser)(req.body);
        return res.status(201).json({
            message: 'User registered successfully',
            ...result,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            error: {
                message: err.message || 'Registration failed',
            },
        });
    }
});
// Login
router.post('/login', rateLimiter_1.authLimiter, async (req, res) => {
    try {
        const validation = (0, authValidator_1.validateLogin)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    errors: validation.errors,
                },
            });
        }
        const result = await (0, authService_1.loginUser)(req.body);
        return res.status(200).json({
            message: 'Login successful',
            ...result,
        });
    }
    catch (error) {
        const err = error;
        return res.status(401).json({
            error: {
                message: err.message || 'Login failed',
            },
        });
    }
});
// Forgot Password
router.post('/forgot-password', rateLimiter_1.passwordResetLimiter, async (req, res) => {
    try {
        const validation = (0, authValidator_1.validateForgotPassword)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    errors: validation.errors,
                },
            });
        }
        const result = await (0, authService_1.forgotPassword)(req.body.email);
        return res.status(200).json(result);
    }
    catch (error) {
        const err = error;
        return res.status(500).json({
            error: {
                message: err.message || 'Failed to process request',
            },
        });
    }
});
// Reset Password
router.post('/reset-password', rateLimiter_1.passwordResetLimiter, async (req, res) => {
    try {
        const validation = (0, authValidator_1.validateResetPassword)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    errors: validation.errors,
                },
            });
        }
        const result = await (0, authService_1.resetPassword)(req.body.token, req.body.password);
        return res.status(200).json({
            message: 'Password reset successful',
            ...result,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            error: {
                message: err.message || 'Password reset failed',
            },
        });
    }
});
// Get current user
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user?.userId) {
            return res.status(401).json({
                error: {
                    message: 'User not authenticated',
                },
            });
        }
        const user = await User_1.default.findById(authReq.user.userId);
        if (!user) {
            return res.status(401).json({
                error: {
                    message: 'User not found',
                },
            });
        }
        return res.status(200).json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                techStacks: user.techStacks,
                resumeUrl: user.resumeUrl,
            },
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({
            error: {
                message: err.message || 'Failed to fetch user',
            },
        });
    }
});
// Update profile
router.put('/me', auth_1.authenticate, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user?.userId) {
            return res.status(401).json({
                error: {
                    message: 'User not authenticated',
                },
            });
        }
        const validation = (0, authValidator_1.validateUpdateProfile)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                error: {
                    message: 'Validation failed',
                    errors: validation.errors,
                },
            });
        }
        const result = await (0, authService_1.updateUserProfile)(authReq.user.userId, req.body);
        return res.status(200).json({
            message: 'Profile updated successfully',
            ...result,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            error: {
                message: err.message || 'Failed to update profile',
            },
        });
    }
});
// Upload Resume
router.post('/me/resume', auth_1.authenticate, upload_1.uploadResume.single('resume'), async (req, res) => {
    try {
        const authReq = req;
        const file = req.file;
        if (!authReq.user?.userId) {
            return res.status(401).json({ error: { message: 'User not authenticated' } });
        }
        if (!file) {
            return res.status(400).json({ error: { message: 'No file uploaded' } });
        }
        // Generate URL path for the uploaded file
        const resumeUrl = `/uploads/resumes/${file.filename}`;
        const user = await User_1.default.findById(authReq.user.userId);
        if (!user) {
            return res.status(404).json({ error: { message: 'User not found' } });
        }
        user.resumeUrl = resumeUrl;
        await user.save();
        return res.status(200).json({
            message: 'Resume uploaded successfully',
            resumeUrl: user.resumeUrl,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({
            error: {
                message: err.message || 'Failed to upload resume',
            },
        });
    }
});
// GET /api/auth/students — List all students directory
router.get('/students', auth_1.authenticate, async (_req, res) => {
    try {
        const students = await User_1.default.find()
            .select('-password -passwordResetToken -passwordResetExpires')
            .lean();
        // Attach application counts for each student
        const Company = (await Promise.resolve().then(() => __importStar(require('../models/Company')))).default;
        const studentIds = students.map(s => s._id);
        const appCounts = await Company.aggregate([
            { $match: { userId: { $in: studentIds } } },
            { $group: { _id: '$userId', total: { $sum: 1 }, selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } } } },
        ]);
        const countMap = new Map(appCounts.map(c => [c._id.toString(), c]));
        const enrichedStudents = students.map(s => ({
            ...s,
            id: s._id.toString(),
            totalApplications: countMap.get(s._id.toString())?.total || 0,
            selectedOffers: countMap.get(s._id.toString())?.selected || 0,
        }));
        return res.status(200).json({ students: enrichedStudents });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch students' } });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map