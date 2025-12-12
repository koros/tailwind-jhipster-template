// Mock dependencies BEFORE importing AuthService
const mockUserRepository = {
  findOne: jest.fn(),
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
    sendActivationEmail: jest.fn(),
  },
}));

// NOW import the service after mocks are set up
import { AuthService } from './auth.service';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';
import mailService from './mail.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        password: await bcrypt.hash('password123', 10),
        activated: true,
        authorities: 'ROLE_USER',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, refreshToken: 'hashed_token' });

      const result = await authService.login('testuser', 'password123', false);

      expect(result.id_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { login: 'testuser' } });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login('nonexistent', 'password123', false)).rejects.toThrow(AppError);
      await expect(authService.login('nonexistent', 'password123', false)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for non-activated user', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        password: await bcrypt.hash('password123', 10),
        activated: false,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(authService.login('testuser', 'password123', false)).rejects.toThrow('User account is not activated');
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        password: await bcrypt.hash('correctpassword', 10),
        activated: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(authService.login('testuser', 'wrongpassword', false)).rejects.toThrow('Invalid credentials');
    });

    it('should handle rememberMe flag correctly', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        password: await bcrypt.hash('password123', 10),
        activated: true,
        authorities: 'ROLE_USER',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await authService.login('testuser', 'password123', true);

      expect(result.id_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.refresh_expires_in).toBeGreaterThan(0);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        activated: true,
        authorities: 'ROLE_USER',
        refreshToken: await bcrypt.hash('valid_refresh_token', 10),
      };

      // Create a valid refresh token
      const refreshToken = jwt.sign(
        { id: 1, sub: 'testuser', type: 'refresh', rememberMe: false },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
        { expiresIn: '7d' },
      );

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return true
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.refreshAccessToken(refreshToken);

      expect(result.id_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('should throw error for invalid token type', async () => {
      const invalidToken = jwt.sign(
        { id: 1, sub: 'testuser', type: 'access' }, // Wrong type
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
        { expiresIn: '7d' },
      );

      await expect(authService.refreshAccessToken(invalidToken)).rejects.toThrow('Invalid token type');
    });

    it('should throw error for non-existent user', async () => {
      const refreshToken = jwt.sign(
        { id: 999, sub: 'testuser', type: 'refresh', rememberMe: false },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
        { expiresIn: '7d' },
      );

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error for expired refresh token', async () => {
      const expiredToken = jwt.sign(
        { id: 1, sub: 'testuser', type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret',
        { expiresIn: '-1s' }, // Already expired
      );

      await expect(authService.refreshAccessToken(expiredToken)).rejects.toThrow('Invalid or expired refresh token');
    });
  });

  describe('logout', () => {
    it('should clear refresh token on logout', async () => {
      const mockUser = { id: 1, login: 'testuser', refreshToken: 'some_token' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, refreshToken: null });

      await authService.logout(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ refreshToken: null }));
    });

    it('should handle logout for non-existent user gracefully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.logout(999)).resolves.toBeUndefined();
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        login: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRepository.create.mockReturnValue({ ...userData, id: 1, activated: false });
      mockUserRepository.save.mockResolvedValue({ ...userData, id: 1, activated: false });

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect((result as any).password).toBeUndefined(); // Password should be excluded
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mailService.sendActivationEmail).toHaveBeenCalled();
    });

    it('should throw error for duplicate activated user', async () => {
      const existingUser = { id: 1, login: 'existing', email: 'existing@example.com', activated: true };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(authService.register({ login: 'existing', email: 'different@example.com', password: 'pass123' })).rejects.toThrow(
        'User already exists',
      );
    });

    it('should allow re-registration for non-activated user', async () => {
      const existingUser = { id: 1, login: 'existing', email: 'existing@example.com', activated: false };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.remove.mockResolvedValue(existingUser);
      mockUserRepository.create.mockReturnValue({ id: 2, login: 'existing', activated: false });
      mockUserRepository.save.mockResolvedValue({ id: 2, login: 'existing', activated: false });

      const result = await authService.register({ login: 'existing', email: 'existing@example.com', password: 'newpass' });

      expect(mockUserRepository.remove).toHaveBeenCalledWith(existingUser);
      expect(result).toBeDefined();
    });

    it('should not fail registration if email sending fails', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ id: 1, login: 'user', activated: false });
      mockUserRepository.save.mockResolvedValue({ id: 1, login: 'user', activated: false });
      (mailService.sendActivationEmail as jest.Mock).mockRejectedValue(new Error('Email failed'));

      const result = await authService.register({ login: 'user', email: 'user@example.com', password: 'pass123' });

      expect(result).toBeDefined();
    });
  });

  describe('activateAccount', () => {
    it('should activate account with valid key', async () => {
      const mockUser = { id: 1, login: 'testuser', activated: false, activationKey: 'valid_key' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({ ...mockUser, activated: true, activationKey: null });

      const result = await authService.activateAccount('valid_key');

      expect(result.message).toBe('Account activated successfully');
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ activated: true, activationKey: null }));
    });

    it('should throw error for invalid activation key', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.activateAccount('invalid_key')).rejects.toThrow('Invalid activation key');
    });
  });
});
