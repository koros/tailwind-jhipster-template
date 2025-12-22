import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import userImageController from '../controllers/user-image.controller';

const router = Router();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/', authenticateToken, upload.single('image'), userImageController.upload);
router.get('/', authenticateToken, userImageController.get);
router.get('/:id', userImageController.getById);

export default router;
