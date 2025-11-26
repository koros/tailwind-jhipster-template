import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';
import crypto from 'crypto';

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  private generateRandomPassword(length: number = 20): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    return password;
  }

  private formatUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      authorities: typeof user.authorities === 'string' ? user.authorities.split(',').filter(a => a.trim()) : user.authorities,
    };
  }

  async getAllUsers(page: number = 0, size: number = 20, sort: string = 'id,asc') {
    const [sortField, sortOrder] = sort.split(',');
    const skip = page * size;

    const [users, total] = await userRepository.findAndCount({
      skip,
      take: size,
      order: { [sortField]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
    });

    // Remove passwords and format authorities
    const formattedUsers = users.map(user => this.formatUser(user));

    return {
      users: formattedUsers,
      total,
      page,
      size,
    };
  }

  async getUserByLogin(login: string) {
    const user = await userRepository.findOne({ where: { login } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.formatUser(user);
  }

  async createUser(userData: {
    login: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    authorities?: string[];
    activated?: boolean;
    langKey?: string;
  }) {
    // Validate required fields
    if (!userData.login || !userData.email) {
      throw new AppError('Login and email are required', 400);
    }

    const existingUser = await userRepository.findOne({
      where: [{ login: userData.login }, { email: userData.email }],
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Generate random password if not provided (admin creating user)
    const password = userData.password || this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only include valid fields, exclude id and audit fields from client
    const user = userRepository.create({
      login: userData.login,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      activated: userData.activated ?? true,
      langKey: userData.langKey || 'en',
      authorities: Array.isArray(userData.authorities) ? userData.authorities.join(',') : userData.authorities || 'ROLE_USER',
      createdBy: 'admin',
      lastModifiedBy: 'admin',
    });

    const savedUser = await userRepository.save(user);
    return this.formatUser(savedUser);
  }

  async updateUser(login: string, userData: Partial<User>) {
    const user = await userRepository.findOne({ where: { login } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow password update through this method
    delete userData.password;

    // Convert authorities array to string if needed
    if (Array.isArray(userData.authorities)) {
      userData.authorities = userData.authorities.join(',') as any;
    }

    Object.assign(user, userData);
    user.lastModifiedBy = 'admin';
    user.lastModifiedDate = new Date();

    const updatedUser = await userRepository.save(user);
    return this.formatUser(updatedUser);
  }

  async deleteUser(login: string) {
    const user = await userRepository.findOne({ where: { login } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async getAuthorities() {
    return ['ROLE_USER', 'ROLE_ADMIN'];
  }
}

export default new UserService();
