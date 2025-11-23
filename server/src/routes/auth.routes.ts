import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/authenticate', authController.login);
router.post('/register', authController.register);
router.get('/activate', authController.activate);

export default router;
