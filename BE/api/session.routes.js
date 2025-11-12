import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { joinSession } from '../controllers/session.controller.js';

const router = Router();

router.post('/join', authMiddleware, joinSession);

export default router;
