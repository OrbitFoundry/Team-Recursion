import { Router, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} from '../services/authService';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
} from '../validators/authValidator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import { uploadResume } from '../middleware/upload';
import User from '../models/User';

const router = Router();

// Register
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const result = await registerUser(req.body);
    return res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({
      error: {
        message: err.message || 'Registration failed',
      },
    });
  }
});

// Login
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const result = await loginUser(req.body);
    return res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(401).json({
      error: {
        message: err.message || 'Login failed',
      },
    });
  }
});

// Forgot Password
router.post('/forgot-password', passwordResetLimiter, async (req: Request, res: Response) => {
  try {
    const validation = validateForgotPassword(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const result = await forgotPassword(req.body.email);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      error: {
        message: err.message || 'Failed to process request',
      },
    });
  }
});

// Reset Password
router.post('/reset-password', passwordResetLimiter, async (req: Request, res: Response) => {
  try {
    const validation = validateResetPassword(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const result = await resetPassword(req.body.token, req.body.password);
    return res.status(200).json({
      message: 'Password reset successful',
      ...result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({
      error: {
        message: err.message || 'Password reset failed',
      },
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user?.userId) {
      return res.status(401).json({
        error: {
          message: 'User not authenticated',
        },
      });
    }
    
    const user = await User.findById(authReq.user.userId);

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
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      error: {
        message: err.message || 'Failed to fetch user',
      },
    });
  }
});

// Update profile
router.put('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.userId) {
      return res.status(401).json({
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const validation = validateUpdateProfile(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const result = await updateUserProfile(authReq.user.userId, req.body);
    return res.status(200).json({
      message: 'Profile updated successfully',
      ...result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({
      error: {
        message: err.message || 'Failed to update profile',
      },
    });
  }
});

// Upload Resume
router.post('/me/resume', authenticate, uploadResume.single('resume'), async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const file = (req as Request & { file?: { filename: string } }).file;

    if (!authReq.user?.userId) {
      return res.status(401).json({ error: { message: 'User not authenticated' } });
    }

    if (!file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    // Generate URL path for the uploaded file
    const resumeUrl = `/uploads/resumes/${file.filename}`;

    const user = await User.findById(authReq.user.userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    user.resumeUrl = resumeUrl;
    await user.save();

    return res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(400).json({
      error: {
        message: err.message || 'Failed to upload resume',
      },
    });
  }
});

// GET /api/auth/students — List all students directory
router.get('/students', authenticate, async (_req: Request, res: Response) => {
  try {
    const students = await User.find()
      .select('-password -passwordResetToken -passwordResetExpires')
      .lean();

    // Attach application counts for each student
    const Company = (await import('../models/Company')).default;
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
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch students' } });
  }
});

export default router;


