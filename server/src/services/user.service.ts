import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';
import { RandomUtil } from '../utils/random.util';
import mailService from './mail.service.js';

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  private formatUser(user: User) {
    const { password: _password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      authorities: typeof user.authorities === 'string' ? user.authorities.split(',').filter(a => a.trim()) : user.authorities,
    };
  }

  async getAllUsers(page: number = 0, size: number = 20, sort: string = 'id,asc') {
    const [sortField, sortOrder] = sort.split(',');
    const skip = page * size;

    const query = userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userImage', 'userImage')
      .select([
        'user.id',
        'user.login',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.activated',
        'user.langKey',
        'user.imageUrl',
        'user.createdDate',
        'user.lastModifiedBy',
        'user.lastModifiedDate',
        'user.authorities',
      ])
      .addSelect('userImage.id')
      .skip(skip)
      .take(size)
      .orderBy(`user.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const [users, total] = await query.getManyAndCount();

    // Remove passwords and format authorities, and set imageUrl
    const formattedUsers = users.map(user => {
      const formatted = this.formatUser(user);
      // @ts-ignore
      if (user.userImage && user.userImage.id) {
        formatted.imageUrl = `/api/user-images/${user.userImage.id}`;
      }
      return formatted;
    });

    return {
      users: formattedUsers,
      total,
      page,
      size,
    };
  }

  async getUserByLogin(login: string) {
    const user = await userRepository.findOne({
      where: { login },
      relations: ['userImage'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const formatted = this.formatUser(user);
    // @ts-ignore
    if (user.userImage) {
      formatted.imageUrl = `/api/user-images/${user.login}`;
    }
    return formatted;
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
    const password = userData.password || RandomUtil.generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate reset key for admin-created users so they can set their own password
    const resetKey = RandomUtil.generateResetKey();
    const resetDate = new Date();

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
      resetKey,
      resetDate,
      createdBy: 'admin',
      lastModifiedBy: 'admin',
    });

    const savedUser = await userRepository.save(user);

    // Send creation email with reset link
    try {
      await mailService.sendCreationEmail(savedUser);
    } catch (error) {
      console.error('Failed to send creation email:', error);
      // Continue even if email fails
    }

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

  getAuthorities() {
    return ['ROLE_USER', 'ROLE_ADMIN'];
  }
}

export default new UserService();
