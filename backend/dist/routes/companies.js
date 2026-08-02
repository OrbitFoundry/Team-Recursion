"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const Company_1 = __importDefault(require("../models/Company"));
const companyValidator_1 = require("../validators/companyValidator");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// GET /api/companies — student's own companies or admin all
router.get('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const { search, status, sort = 'desc', all } = req.query;
        // Build query scoped to user or all if requested
        const query = (all === 'true')
            ? {}
            : { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (search) {
            query.companyName = { $regex: search, $options: 'i' };
        }
        if (status) {
            query.status = status;
        }
        const sortOrder = sort === 'asc' ? 1 : -1;
        const companies = await Company_1.default.find(query)
            .populate('userId', 'name email techStacks resumeUrl')
            .sort({ applicationDate: sortOrder })
            .lean();
        return res.status(200).json({ companies });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch companies' } });
    }
});
// POST /api/companies — add company
router.post('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const validation = (0, companyValidator_1.validateCreateCompany)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const { companyName, role, applicationDate, status, companyLink, techStacks, notes } = req.body;
        const company = await Company_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            companyName: companyName.trim(),
            role: role.trim(),
            applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
            status: status || 'Applied',
            companyLink: companyLink?.trim(),
            techStacks: techStacks || [],
            notes: notes?.trim(),
        });
        return res.status(201).json({ company });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to create company' } });
    }
});
// PUT /api/companies/:id — update company (own or admin)
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid company ID format' } });
        }
        const validation = (0, companyValidator_1.validateUpdateCompany)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const authReq = req;
        const userId = authReq.user?.userId;
        const filter = { _id: req.params.id };
        if (authReq.user?.role === 'student' && userId) {
            filter.userId = new mongoose_1.default.Types.ObjectId(userId);
        }
        const company = await Company_1.default.findOneAndUpdate(filter, { $set: req.body }, { new: true, runValidators: true });
        if (!company) {
            return res.status(404).json({ error: { message: 'Company not found or access denied' } });
        }
        return res.status(200).json({ company });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to update company' } });
    }
});
// DELETE /api/companies/:id — delete company
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid company ID format' } });
        }
        const authReq = req;
        const userId = authReq.user?.userId;
        const filter = { _id: req.params.id };
        if (authReq.user?.role === 'student' && userId) {
            filter.userId = new mongoose_1.default.Types.ObjectId(userId);
        }
        const company = await Company_1.default.findOneAndDelete(filter);
        if (!company) {
            return res.status(404).json({ error: { message: 'Company not found or access denied' } });
        }
        return res.status(200).json({ message: 'Company deleted successfully' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to delete company' } });
    }
});
exports.default = router;
//# sourceMappingURL=companies.js.map