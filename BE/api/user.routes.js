
import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { updateWeeklyGoalController } from '../controllers/user.controller.js';

const router = Router();

router.put('/goal', authMiddleware, updateWeeklyGoalController);

export default router;
