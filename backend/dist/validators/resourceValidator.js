"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateResource = void 0;
const VALID_CATEGORIES = ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'];
const validateCreateResource = (data) => {
    const errors = [];
    if (!data.title || data.title.trim().length < 1) {
        errors.push('Title is required');
    }
    if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
        errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
    if (!data.link || data.link.trim().length < 1) {
        errors.push('Link is required');
    }
    else {
        try {
            new URL(data.link);
        }
        catch {
            errors.push('Link must be a valid URL');
        }
    }
    return { isValid: errors.length === 0, errors };
};
exports.validateCreateResource = validateCreateResource;
//# sourceMappingURL=resourceValidator.js.map