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

    const expiresIn = rememberMe ? jwtConfig.expiresIn * 30 : jwtConfig.expiresIn;

    const token = jwt.sign(
      {
        id: user.id,
        sub: user.login,
        auth: user.authorities, // Already a comma-separated string
      },
      jwtConfig.secret,
      { expiresIn },
    );

    return { id_token: token };
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
      authorities: ['ROLE_USER'],
      createdBy: 'system',
      lastModifiedBy: 'system',
    });

    await userRepository.save(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
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
