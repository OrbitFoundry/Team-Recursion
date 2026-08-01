import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

// Example route
router.get('/', (_req, res) => {
  res.json({ 
    message: 'API Routes',
    version: '1.0.0'
  });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;
