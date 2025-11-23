import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import accountController from '../controllers/account.controller';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/account', authenticateToken, accountController.getAccount);
router.post('/account', authenticateToken, accountController.saveAccount);
router.post('/account/change-password', authenticateToken, accountController.changePassword);
router.post('/account/reset-password/init', accountController.requestPasswordReset);
router.post('/account/reset-password/finish', accountController.finishPasswordReset);
router.get('/authorities', authenticateToken, userController.getAuthorities);

export default router;
