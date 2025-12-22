import { Request, Response, NextFunction } from 'express';
import userImageService from '../services/user-image.service';

export class UserImageController {
  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // @ts-ignore
      const userId = req.user.id;
      // @ts-ignore
      const buffer = req.file.buffer;
      // @ts-ignore
      const contentType = req.file.mimetype;

      await userImageService.uploadImage(userId, buffer, contentType);
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const image = await userImageService.getImage(userId);

      res.set('Content-Type', image.contentType);
      res.send(image.image);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const image = await userImageService.getImageById(id);

      res.set('Content-Type', image.contentType);
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.send(image.image);
    } catch (error) {
      // If image not found, we could return 404, which is handled by next(error) if it throws AppError(404)
      next(error);
    }
  };
}

export default new UserImageController();
