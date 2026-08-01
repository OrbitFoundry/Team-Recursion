import { Router } from 'express';
import authRoutes from './auth';
import companyRoutes from './companies';
import resourceRoutes from './resources';
import dashboardRoutes from './dashboard';
import timelineRoutes from './timeline';


const router = Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'cooked? API',
    version: '2.0.0',
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Student routes
router.use('/companies', companyRoutes);
router.use('/resources', resourceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/timeline', timelineRoutes);



export default router;
