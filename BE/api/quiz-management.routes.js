import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createQuizController, getQuizController } from '../controllers/quiz-management.controller.js';

const router = Router();

router.post('/', authMiddleware, createQuizController);
router.get('/:page_id', authMiddleware, getQuizController);

export default router;