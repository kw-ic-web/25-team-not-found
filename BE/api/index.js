import { Router } from 'express';
import dashboardRoutes from './dashboard.routes.js';
import textbookRoutes from './textbook.routes.js';
import annotationRoutes from './annotation.routes.js';
import quizRoutes from './quiz.routes.js';
import sessionRoutes from './session.routes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/textbooks', textbookRoutes);
router.use('/annotations', annotationRoutes);
router.use('/quizzes', quizRoutes);
router.use('/sessions', sessionRoutes);

export default router;
