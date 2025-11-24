import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, rememberMe } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const result = await authService.login(username, password, rememberMe);
      // Set token in Authorization header for JHipster frontend
      res.setHeader('Authorization', `Bearer ${result.id_token}`);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      const result = await authService.refreshAccessToken(refresh_token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await authService.logout(req.user.id);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.query;

      if (!key || typeof key !== 'string') {
        return res.status(400).json({ message: 'Activation key required' });
      }

      const result = await authService.activateAccount(key);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
