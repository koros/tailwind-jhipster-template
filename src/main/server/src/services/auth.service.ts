import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../middleware/error.middleware';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async login(username: string, password: string, rememberMe: boolean = false) {
    const user = await userRepository.findOne({ where: { login: username } });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.activated) {
      throw new AppError('User account is not activated', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      {
        id: user.id,
        sub: user.login,
        auth: user.authorities,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn },
    );

    // Generate refresh token (long-lived)
    const refreshTokenExpiresIn = rememberMe ? jwtConfig.refreshExpiresIn * 4 : jwtConfig.refreshExpiresIn;
    const refreshToken = jwt.sign(
      {
        id: user.id,
        sub: user.login,
        type: 'refresh',
      },
      jwtConfig.refreshSecret,
      { expiresIn: refreshTokenExpiresIn },
    );

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return {
      id_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as any;

      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Find user and verify refresh token matches stored one
      const user = await userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      if (!user.activated) {
        throw new AppError('User account is not activated', 401);
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          id: user.id,
          sub: user.login,
          auth: user.authorities,
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
      );

      return { id_token: accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid or expired refresh token', 401);
      }
      throw error;
    }
  }

  async logout(userId: number) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.refreshToken = null;
      await userRepository.save(user);
    }
  }

  async register(userData: { login: string; email: string; password: string; firstName?: string; lastName?: string; langKey?: string }) {
    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ login: userData.login }, { email: userData.email }],
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const user = userRepository.create({
      ...userData,
      password: hashedPassword,
      activated: true, // Auto-activate for simplicity
      authorities: 'ROLE_USER',
      createdBy: 'system',
      lastModifiedBy: 'system',
    });

    await userRepository.save(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async activateAccount(key: string) {
    const user = await userRepository.findOne({ where: { activationKey: key } });

    if (!user) {
      throw new AppError('Invalid activation key', 400);
    }

    user.activated = true;
    user.activationKey = null;
    await userRepository.save(user);

    return { message: 'Account activated successfully' };
  }
}

export default new AuthService();
