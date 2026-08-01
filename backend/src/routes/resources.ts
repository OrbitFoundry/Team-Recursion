import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticate, AuthRequest } from '../middleware/auth';
import Resource from '../models/Resource';
import { validateCreateResource } from '../validators/resourceValidator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/resources — student's own resources (filter by category)
router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const { category } = req.query as { category?: string };

    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

    if (category) {
      query.category = category;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 }).lean();

    return res.status(200).json({ resources });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch resources' } });
  }
});

// POST /api/resources — add resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const validation = validateCreateResource(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
    }

    const { title, category, link } = req.body;

    const resource = await Resource.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: title.trim(),
      category,
      link: link.trim(),
    });

    return res.status(201).json({ resource });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to create resource' } });
  }
});

// DELETE /api/resources/:id — delete own resource only
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid resource ID format' } });
    }

    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    // Enforce userId match
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!resource) {
      return res.status(404).json({ error: { message: 'Resource not found or access denied' } });
    }

    return res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to delete resource' } });
  }
});

export default router;
