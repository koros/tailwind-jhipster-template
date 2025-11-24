import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';

const userRepository = AppDataSource.getRepository(User);

const formatUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    authorities: typeof user.authorities === 'string' ? user.authorities.split(',').filter(a => a.trim()) : user.authorities,
  };
};

export class AccountController {
  async getAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json(formatUser(user));
    } catch (error) {
      next(error);
    }
  }

  async saveAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update allowed fields
      const { firstName, lastName, email, langKey, imageUrl } = req.body;

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (email !== undefined) user.email = email;
      if (langKey !== undefined) user.langKey = langKey;
      if (imageUrl !== undefined) user.imageUrl = imageUrl;

      user.lastModifiedBy = user.login;
      user.lastModifiedDate = new Date();

      const savedUser = await userRepository.save(user);

      res.json(formatUser(savedUser));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password required' });
      }

      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Hash and save new password
      user.password = await bcrypt.hash(newPassword, 10);
      user.lastModifiedBy = user.login;
      user.lastModifiedDate = new Date();

      await userRepository.save(user);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as unknown as { email: string };

      if (!email) {
        return res.status(400).json({ message: 'Email required' });
      }

      // In production, generate reset key and send email
      // For now, just return success
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  };

  finishPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, newPassword } = req.body as unknown as { key: string; newPassword: string };

      if (!key || !newPassword) {
        return res.status(400).json({ message: 'Reset key and new password required' });
      }

      const user = await userRepository.findOne({ where: { resetKey: key } });

      if (!user) {
        throw new AppError('Invalid reset key', 400);
      }

      // Check if reset key is expired (within 24 hours)
      if (user.resetDate) {
        const now = new Date();
        const resetDate = new Date(user.resetDate);
        const hoursDiff = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
          throw new AppError('Reset key expired', 400);
        }
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetKey = null;
      user.resetDate = null;
      user.lastModifiedBy = 'system';
      user.lastModifiedDate = new Date();

      await userRepository.save(user);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default new AccountController();
