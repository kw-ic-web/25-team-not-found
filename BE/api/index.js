import { Router } from 'express';
import dashboardRoutes from './dashboard.routes.js';
import textbookRoutes from './textbook.routes.js';
import annotationRoutes from './annotation.routes.js';
import quizRoutes from './quiz.routes.js';
import sessionRoutes from './session.routes.js';
import quizManagementRoutes from './quiz-management.routes.js';
import authRoutes from './auth.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import learnRoutes from './learn.routes.js';
import teacherRoutes from './teacher.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/textbooks', textbookRoutes);
router.use('/annotations', annotationRoutes);
router.use('/quizzes', quizRoutes);
router.use('/sessions', sessionRoutes);
router.use('/quiz-managements', quizManagementRoutes);
router.use('/auth', authRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/learn', learnRoutes);
router.use('/teacher', teacherRoutes);
router.use('/users', userRoutes);

export default router;
