import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    login: string;
    authorities: string[];
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as any;
    req.user = {
      id: decoded.id,
      login: decoded.sub,
      authorities: decoded.auth ? decoded.auth.split(',') : [],
    };
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.authorities.includes('ROLE_ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
