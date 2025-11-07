import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getPageContent } from '../controllers/textbook.controller.js';

const router = Router();

router.get('/:textbook_id/pages/:page_number', authMiddleware, getPageContent);

export default router;
