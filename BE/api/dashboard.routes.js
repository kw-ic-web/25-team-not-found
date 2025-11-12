import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getDashboardData } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', authMiddleware, getDashboardData);

export default router;
