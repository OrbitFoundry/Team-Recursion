"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProfile = exports.validateForgotPassword = exports.validateResetPassword = exports.validateLogin = exports.validateRegister = void 0;
/**
 * Validates password strength
 * Requirements: min 8 chars, uppercase, lowercase, number, special char
 */
const validatePasswordStrength = (password) => {
    const errors = [];
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    else {
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[^a-zA-Z\d]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
    }
    return errors;
};
const validateRegister = (data) => {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please provide a valid email address');
    }
    if (data.password) {
        errors.push(...validatePasswordStrength(data.password));
    }
    else {
        errors.push('Password is required');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateRegister = validateRegister;
const validateLogin = (data) => {
    const errors = [];
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please provide a valid email address');
    }
    if (!data.password) {
        errors.push('Password is required');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateLogin = validateLogin;
const validateResetPassword = (data) => {
    const errors = [];
    if (!data.token) {
        errors.push('Reset token is required');
    }
    if (data.password) {
        errors.push(...validatePasswordStrength(data.password));
    }
    else {
        errors.push('Password is required');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateResetPassword = validateResetPassword;
const validateForgotPassword = (data) => {
    const errors = [];
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please provide a valid email address');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateForgotPassword = validateForgotPassword;
const validateUpdateProfile = (data) => {
    const errors = [];
    if (data.name !== undefined && (data.name.trim().length < 2)) {
        errors.push('Name must be at least 2 characters long');
    }
    if (data.email !== undefined && (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
        errors.push('Please provide a valid email address');
    }
    if (data.techStacks !== undefined) {
        if (!Array.isArray(data.techStacks)) {
            errors.push('Tech stacks must be an array of strings');
        }
        else if (data.techStacks.length > 50) {
            errors.push('Maximum 50 tech stacks allowed');
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateUpdateProfile = validateUpdateProfile;
//# sourceMappingURL=authValidator.js.map