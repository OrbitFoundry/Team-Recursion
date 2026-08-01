"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const Resource_1 = __importDefault(require("../models/Resource"));
const resourceValidator_1 = require("../validators/resourceValidator");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// GET /api/resources — student's own resources (filter by category)
router.get('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const { category } = req.query;
        const query = { userId: new mongoose_1.default.Types.ObjectId(userId) };
        if (category) {
            query.category = category;
        }
        const resources = await Resource_1.default.find(query).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ resources });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch resources' } });
    }
});
// POST /api/resources — add resource
router.post('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const validation = (0, resourceValidator_1.validateCreateResource)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const { title, category, link } = req.body;
        const resource = await Resource_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            title: title.trim(),
            category,
            link: link.trim(),
        });
        return res.status(201).json({ resource });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to create resource' } });
    }
});
// PUT /api/resources/:id — update own resource
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid resource ID format' } });
        }
        const authReq = req;
        const userId = authReq.user.userId;
        const validation = (0, resourceValidator_1.validateCreateResource)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const { title, category, link } = req.body;
        const resource = await Resource_1.default.findOneAndUpdate({ _id: req.params.id, userId: new mongoose_1.default.Types.ObjectId(userId) }, {
            $set: {
                title: title.trim(),
                category,
                link: link.trim(),
            },
        }, { new: true, runValidators: true });
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found or access denied' } });
        }
        return res.status(200).json({ resource });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to update resource' } });
    }
});
// DELETE /api/resources/:id — delete own resource only
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid resource ID format' } });
        }
        const authReq = req;
        const userId = authReq.user.userId;
        // Enforce userId match
        const resource = await Resource_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found or access denied' } });
        }
        return res.status(200).json({ message: 'Resource deleted successfully' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to delete resource' } });
    }
});
exports.default = router;
//# sourceMappingURL=resources.js.map