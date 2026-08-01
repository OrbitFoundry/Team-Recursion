"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
const timelineValidator_1 = require("../validators/timelineValidator");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// GET /api/timeline — get all events for user sorted by date
router.get('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const events = await TimelineEvent_1.default.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ date: 1 }) // Chronological order
            .lean();
        return res.status(200).json({ events });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to fetch timeline events' } });
    }
});
// POST /api/timeline — add new event
router.post('/', async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user.userId;
        const validation = (0, timelineValidator_1.validateTimelineEvent)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const { title, description, date } = req.body;
        const event = await TimelineEvent_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            title: title.trim(),
            description: description?.trim(),
            date: new Date(date),
        });
        return res.status(201).json({ event });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to create timeline event' } });
    }
});
// PUT /api/timeline/:id — update existing event
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid event ID format' } });
        }
        const authReq = req;
        const userId = authReq.user.userId;
        const validation = (0, timelineValidator_1.validateTimelineEvent)(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
        }
        const { title, description, date } = req.body;
        const event = await TimelineEvent_1.default.findOneAndUpdate({ _id: req.params.id, userId: new mongoose_1.default.Types.ObjectId(userId) }, {
            $set: {
                title: title.trim(),
                description: description?.trim(),
                date: new Date(date),
            },
        }, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ error: { message: 'Event not found or access denied' } });
        }
        return res.status(200).json({ event });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to update timeline event' } });
    }
});
// DELETE /api/timeline/:id — delete event
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: { message: 'Invalid event ID format' } });
        }
        const authReq = req;
        const userId = authReq.user.userId;
        const event = await TimelineEvent_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!event) {
            return res.status(404).json({ error: { message: 'Event not found or access denied' } });
        }
        return res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: { message: err.message || 'Failed to delete timeline event' } });
    }
});
exports.default = router;
//# sourceMappingURL=timeline.js.map