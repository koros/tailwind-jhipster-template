import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/users', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/users/authorities', authenticateToken, requireAdmin, userController.getAuthorities);
router.get('/users/:login', authenticateToken, requireAdmin, userController.getUser);
router.post('/users', authenticateToken, requireAdmin, userController.createUser);
router.put('/users', authenticateToken, requireAdmin, userController.updateUser);
router.put('/users/:login', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/users/:login', authenticateToken, requireAdmin, userController.deleteUser);

export default router;
