import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation
} from '../controllers/annotation.controller.js';

const router = Router();

// GET /?page_id={id} OR /?textbook_id={id}
router.get('/', authMiddleware, getAnnotations);
router.post('/', authMiddleware, createAnnotation);
router.put('/:annotation_id', authMiddleware, updateAnnotation);
router.delete('/:annotation_id', authMiddleware, deleteAnnotation);

export default router;
