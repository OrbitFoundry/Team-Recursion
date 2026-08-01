import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticate, AuthRequest } from '../middleware/auth';
import Company from '../models/Company';
import { validateCreateCompany, validateUpdateCompany } from '../validators/companyValidator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/companies — student's own companies or admin all
router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;
    const isAdmin = authReq.user?.role === 'admin';

    const { search, status, sort = 'desc', all } = req.query as {
      search?: string;
      status?: string;
      sort?: string;
      all?: string;
    };

    // Build query scoped to user or all if admin
    const query: Record<string, unknown> = (isAdmin && all === 'true')
      ? {}
      : { userId: new mongoose.Types.ObjectId(userId) };

    if (search) {
      query.companyName = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;

    const companies = await Company.find(query)
      .populate('userId', 'name email techStacks resumeUrl')
      .sort({ applicationDate: sortOrder })
      .lean();

    return res.status(200).json({ companies });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to fetch companies' } });
  }
});

// POST /api/companies — add company
router.post('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;

    const validation = validateCreateCompany(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
    }

    const { companyName, role, applicationDate, status, companyLink, techStacks, notes } = req.body;

    const company = await Company.create({
      userId: new mongoose.Types.ObjectId(userId),
      companyName: companyName.trim(),
      role: role.trim(),
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      status: status || 'Applied',
      companyLink: companyLink?.trim(),
      techStacks: techStacks || [],
      notes: notes?.trim(),
    });

    return res.status(201).json({ company });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to create company' } });
  }
});

// PUT /api/companies/:id — update company (own or admin)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid company ID format' } });
    }

    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;
    const isAdmin = authReq.user?.role === 'admin';

    const validation = validateUpdateCompany(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: validation.errors } });
    }

    const filter = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: new mongoose.Types.ObjectId(userId) };

    const company = await Company.findOneAndUpdate(
      filter,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ error: { message: 'Company not found or access denied' } });
    }

    return res.status(200).json({ company });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to update company' } });
  }
});

// DELETE /api/companies/:id — delete company (own or admin)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: { message: 'Invalid company ID format' } });
    }

    const authReq = req as AuthRequest;
    const userId = authReq.user!.userId;
    const isAdmin = authReq.user?.role === 'admin';

    const filter = isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: new mongoose.Types.ObjectId(userId) };

    const company = await Company.findOneAndDelete(filter);

    if (!company) {
      return res.status(404).json({ error: { message: 'Company not found or access denied' } });
    }

    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: { message: err.message || 'Failed to delete company' } });
  }
});

export default router;
