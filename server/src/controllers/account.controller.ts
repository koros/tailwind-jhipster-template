import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';
import { RandomUtil } from '../utils/random.util';
import mailService from '../services/mail.service.js';

const userRepository = AppDataSource.getRepository(User);

const formatUser = (user: User) => {
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

      if (firstName !== undefined) {
        user.firstName = firstName;
      }
      if (lastName !== undefined) {
        user.lastName = lastName;
      }
      if (email !== undefined) {
        user.email = email;
      }
      if (langKey !== undefined) {
        user.langKey = langKey;
      }
      if (imageUrl !== undefined) {
        user.imageUrl = imageUrl;
      }

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
      // Support both text/plain body (raw email string) and JSON { email }
      const email = typeof req.body === 'string' ? req.body : req.body?.email;

      if (!email) {
        return res.status(400).json({ message: 'Email required' });
      }

      // Find user by email
      const user = await userRepository.findOne({
        where: { email: email.toLowerCase() },
      });

      if (user && user.activated) {
        // Generate reset key and expiry
        user.resetKey = RandomUtil.generateResetKey();
        user.resetDate = new Date();
        await userRepository.save(user);

        // Send password reset email
        try {
          await mailService.sendPasswordResetEmail(user);
        } catch (error) {
          console.error('Failed to send password reset email:', error);
          // Continue even if email fails
        }
      }

      // Always return success to prevent email enumeration
      res.json({ message: 'Password reset email sent if the email exists' });
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

      // Use a transaction + row lock to ensure single-use reset keys
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // Lock the user row with this reset key to avoid concurrent reuse
        const lockedUser = await queryRunner.manager
          .getRepository(User)
          .createQueryBuilder('user')
          .setLock('pessimistic_write')
          .where('user.resetKey = :key', { key })
          .getOne();

        if (!lockedUser) {
          throw new AppError('Invalid reset key', 400);
        }

        // Check if reset key is expired (within 24 hours)
        if (lockedUser.resetDate) {
          const now = new Date();
          const resetDate = new Date(lockedUser.resetDate);
          const hoursDiff = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60);

          if (hoursDiff > 24) {
            throw new AppError('Reset key expired', 400);
          }
        }

        lockedUser.password = await bcrypt.hash(newPassword, 10);
        lockedUser.resetKey = null;
        lockedUser.resetDate = null;
        lockedUser.lastModifiedBy = 'system';
        lockedUser.lastModifiedDate = new Date();

        await queryRunner.manager.getRepository(User).save(lockedUser);
        await queryRunner.commitTransaction();
        res.json({ message: 'Password reset successfully' });
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      next(error);
    }
  };
}

export default new AccountController();
