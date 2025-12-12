// Mock dependencies BEFORE importing
const mockUserRepository = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockUserRepository),
    isInitialized: true,
  },
}));

jest.mock('./mail.service', () => ({
  __esModule: true,
  default: {
    sendCreationEmail: jest.fn(),
  },
}));

import { UserService } from './user.service';
import { AppError } from '../middleware/error.middleware';
import bcrypt from 'bcryptjs';
import mailService from './mail.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users without passwords', async () => {
      const mockUsers = [
        { id: 1, login: 'user1', email: 'user1@example.com', password: 'hashed', authorities: 'ROLE_USER' },
        { id: 2, login: 'user2', email: 'user2@example.com', password: 'hashed', authorities: 'ROLE_ADMIN' },
      ];

      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await userService.getAllUsers(0, 20, 'id,asc');

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.users[0]).not.toHaveProperty('password');
      expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      mockUserRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await userService.getAllUsers(1, 10, 'id,desc');

      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        order: { id: 'DESC' },
      });
    });
  });

  describe('getUserByLogin', () => {
    it('should return user by login without password', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        password: 'hashed',
        authorities: 'ROLE_USER',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUserByLogin('testuser');

      expect(result.login).toBe('testuser');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getUserByLogin('nonexistent')).rejects.toThrow(AppError);
      await expect(userService.getUserByLogin('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create user with provided data', async () => {
      const userData = {
        login: 'newuser',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...userData, id: 1 });
      mockUserRepository.save.mockResolvedValue({ ...userData, id: 1 });

      const result = await userService.createUser(userData);

      expect(result.login).toBe('newuser');
      expect(result).not.toHaveProperty('password');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mailService.sendCreationEmail).toHaveBeenCalled();
    });

    it('should throw error for missing required fields', async () => {
      await expect(userService.createUser({ login: '', email: '' })).rejects.toThrow('Login and email are required');
    });

    it('should throw error for duplicate user', async () => {
      const existingUser = { id: 1, login: 'existing', email: 'existing@example.com' };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(userService.createUser({ login: 'existing', email: 'new@example.com' })).rejects.toThrow('User already exists');
    });

    it('should generate password if not provided', async () => {
      const userData = { login: 'newuser', email: 'new@example.com' };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...userData, id: 1 });
      mockUserRepository.save.mockResolvedValue({ ...userData, id: 1 });

      const result = await userService.createUser(userData);

      expect(result).toBeDefined();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should not fail if email sending fails', async () => {
      const userData = { login: 'newuser', email: 'new@example.com' };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...userData, id: 1 });
      mockUserRepository.save.mockResolvedValue({ ...userData, id: 1 });
      (mailService.sendCreationEmail as jest.Mock).mockRejectedValue(new Error('Email failed'));

      const result = await userService.createUser(userData);

      expect(result).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = { id: 1, login: 'testuser', email: 'test@example.com' };
      const updateData = { firstName: 'Updated', lastName: 'Name' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({ ...existingUser, ...updateData });

      const result = await userService.updateUser('testuser', updateData);

      expect(result.firstName).toBe('Updated');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.updateUser('nonexistent', { firstName: 'Test' })).rejects.toThrow('User not found');
    });

    it('should not allow password update', async () => {
      const existingUser = { id: 1, login: 'testuser', password: 'old_hash' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(existingUser);

      await userService.updateUser('testuser', { password: 'newhash' } as any);

      const saveCall = mockUserRepository.save.mock.calls[0][0];
      expect(saveCall.password).toBe('old_hash');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = { id: 1, login: 'testuser' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await userService.deleteUser('testuser');

      expect(result.message).toBe('User deleted successfully');
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.deleteUser('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('getAuthorities', () => {
    it('should return available authorities', () => {
      const authorities = userService.getAuthorities();

      expect(authorities).toContain('ROLE_USER');
      expect(authorities).toContain('ROLE_ADMIN');
    });
  });
});
