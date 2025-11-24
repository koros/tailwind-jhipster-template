import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import accountController from '../controllers/account.controller';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/account', authenticateToken, accountController.getAccount.bind(accountController));
router.post('/account', authenticateToken, accountController.saveAccount.bind(accountController));
router.post('/account/change-password', authenticateToken, accountController.changePassword.bind(accountController));
// router.post('/account/reset-password/init', (req, res, next) => accountController.requestPasswordReset(req, res, next));
// router.post('/account/reset-password/finish', (req, res, next) => accountController.finishPasswordReset(req, res, next));
router.get('/authorities', authenticateToken, userController.getAuthorities.bind(userController));

export default router;
