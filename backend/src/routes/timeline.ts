import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticate, AuthRequest } from '../middleware/auth';
import TimelineEvent from '../models/TimelineEvent';
import { validateTimelineEvent } from '../validators/timelineValidator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/timeline — get all events for user sorted by date
router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const events = await TimelineEvent.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ date: 1 }) // Chronological order
      .lean();

    return res.status(200).json({ events });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch timeline events' } });
  }
});

// POST /api/timeline — add new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const validation = validateTimelineEvent(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
    }

    const { title, description, date } = req.body;

    const event = await TimelineEvent.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: title.trim(),
      description: description?.trim(),
      date: new Date(date),
    });

    return res.status(201).json({ event });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to create timeline event' } });
  }
});

// PUT /api/timeline/:id — update existing event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid event ID format' } });
    }

    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const validation = validateTimelineEvent(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
    }

    const { title, description, date } = req.body;

    const event = await TimelineEvent.findOneAndUpdate(
      { _id: req.params.id, userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          title: title.trim(),
          description: description?.trim(),
          date: new Date(date),
        },
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found or access denied' } });
    }

    return res.status(200).json({ event });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to update timeline event' } });
  }
});

// DELETE /api/timeline/:id — delete event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid event ID format' } });
    }

    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const event = await TimelineEvent.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found or access denied' } });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to delete timeline event' } });
  }
});

export default router;
