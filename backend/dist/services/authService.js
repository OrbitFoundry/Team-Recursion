"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.findOrCreateGoogleUser = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const tokenService_1 = require("./tokenService");
const emailService_1 = require("./emailService");
const logger_1 = require("../utils/logger");
const registerUser = async (data) => {
    const name = data.name.trim();
    const email = data.email.toLowerCase().trim();
    const { password } = data;
    // Check if user already exists (generic error for security)
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('Registration failed. Please try again.');
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Create user (default role: student)
    const user = await User_1.default.create({
        name,
        email,
        password: hashedPassword,
        role: 'student',
        isEmailVerified: false,
    });
    // Send welcome email (non-blocking)
    (0, emailService_1.sendWelcomeEmail)(email, name).catch((error) => {
        logger_1.logger.debug('Failed to send welcome email:', error);
    });
    // Generate token with role
    const token = (0, tokenService_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            techStacks: user.techStacks,
            resumeUrl: user.resumeUrl,
        },
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const email = data.email.toLowerCase().trim();
    const { password } = data;
    // Find user and include password
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Check if user has password (Google OAuth users might not)
    if (!user.password) {
        throw new Error('Please sign in with Google or set a password');
    }
    // Verify password
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Generate token with role
    const token = (0, tokenService_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            techStacks: user.techStacks,
            resumeUrl: user.resumeUrl,
        },
        token,
    };
};
exports.loginUser = loginUser;
const forgotPassword = async (rawEmail) => {
    const email = rawEmail.toLowerCase().trim();
    const user = await User_1.default.findOne({ email });
    if (!user) {
        // Don't reveal if user exists for security
        return { message: 'If an account exists, a password reset email has been sent' };
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    // Hash the token before storing (security best practice)
    const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    // Send reset email with the original (unhashed) token (non-blocking)
    (0, emailService_1.sendPasswordResetEmail)(email, resetToken).catch((error) => {
        logger_1.logger.error('Failed to send password reset email:', error);
    });
    return { message: 'If an account exists, a password reset email has been sent' };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    // Hash the provided token to compare with stored hashed token
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await User_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new Error('Invalid or expired reset token');
    }
    // Hash new password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    // Generate token with role
    const authToken = (0, tokenService_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            techStacks: user.techStacks,
            resumeUrl: user.resumeUrl,
        },
        token: authToken,
    };
};
exports.resetPassword = resetPassword;
const findOrCreateGoogleUser = async (googleId, email, name) => {
    let user = await User_1.default.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
    }
    else {
        // Create new user as student by default
        user = await User_1.default.create({
            name,
            email,
            googleId,
            role: 'student',
            isEmailVerified: true, // Google emails are verified
        });
    }
    const token = (0, tokenService_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            techStacks: user.techStacks,
            resumeUrl: user.resumeUrl,
        },
        token,
    };
};
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
const updateUserProfile = async (userId, data) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (data.email && data.email !== user.email) {
        const existingUser = await User_1.default.findOne({ email: data.email, _id: { $ne: userId } });
        if (existingUser) {
            throw new Error('Email is already in use by another account');
        }
        user.email = data.email;
        user.isEmailVerified = false; // Require re-verification if email changed
    }
    if (data.name) {
        user.name = data.name.trim();
    }
    if (data.techStacks !== undefined) {
        user.techStacks = data.techStacks;
    }
    await user.save();
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            techStacks: user.techStacks,
            resumeUrl: user.resumeUrl,
        },
    };
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=authService.js.map