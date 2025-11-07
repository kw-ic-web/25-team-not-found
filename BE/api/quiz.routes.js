import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getQuizQuestions, submitQuizAnswers } from '../controllers/quiz.controller.js';

const router = Router();

router.get('/:quiz_id/questions', authMiddleware, getQuizQuestions);
router.post('/:quiz_id/submit', authMiddleware, submitQuizAnswers);

export default router;
