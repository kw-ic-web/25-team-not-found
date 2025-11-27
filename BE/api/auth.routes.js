import { Router } from 'express';
import { registerController, loginController, checkUsernameController } from '../controllers/user.controller.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/check-username', checkUsernameController);

export default router;