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

      // HttpOnly refresh token cookie
      const maxAgeMs = result.refresh_expires_in * 1000;
      res.cookie('refreshToken', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api',
        maxAge: maxAgeMs,
      });

      // Set access token in Authorization header for frontend
      res.setHeader('Authorization', `Bearer ${result.id_token}`);

      // Return only access token (omit refresh token from body)
      res.json({ id_token: result.id_token });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.cookies?.refreshToken;
      if (!cookieToken) {
        return res.status(401).json({ message: 'Refresh token cookie missing' });
      }
      const result = await authService.refreshAccessToken(cookieToken);
      // Rotate cookie
      const maxAgeMs = result.refresh_expires_in * 1000;
      res.cookie('refreshToken', result.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api',
        maxAge: maxAgeMs,
      });
      res.setHeader('Authorization', `Bearer ${result.id_token}`);
      res.json({ id_token: result.id_token });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await authService.logout(req.user.id);
      }
      // Clear refresh token cookie
      res.clearCookie('refreshToken', { path: '/api' });
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
