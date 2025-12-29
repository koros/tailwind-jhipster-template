import { Request, Response, NextFunction } from 'express';
import { AuthController } from './auth.controller';
import authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

jest.mock('../services/auth.service', () => ({
  login: jest.fn(),
  refreshAccessToken: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  activateAccount: jest.fn(),
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.cookie = jest.fn().mockReturnThis();
  res.clearCookie = jest.fn().mockReturnThis();
  res.setHeader = jest.fn();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

describe('AuthController', () => {
  const controller = new AuthController();
  const originalNodeEnv = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should require username and password', async () => {
      const req = { body: { password: 'secret' } } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username and password required' });
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should authenticate user and set headers/cookies', async () => {
      const req = { body: { username: 'user', password: 'secret', rememberMe: true } } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      mockAuthService.login.mockResolvedValue({
        id_token: 'access-token',
        refresh_token: 'refresh-token',
        refresh_expires_in: 1800,
      });

      await controller.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith('user', 'secret', true);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({ httpOnly: true, path: '/api', maxAge: 1800 * 1000 }),
      );
      expect(res.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer access-token');
      expect(res.json).toHaveBeenCalledWith({ id_token: 'access-token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should return 401 when cookie missing', async () => {
      const req = { cookies: {} } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.refreshToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token cookie missing' });
      expect(mockAuthService.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('should rotate refresh token and return new access token', async () => {
      const req = { cookies: { refreshToken: 'old-token' } } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      mockAuthService.refreshAccessToken.mockResolvedValue({
        id_token: 'new-access',
        refresh_token: 'new-refresh',
        refresh_expires_in: 3600,
      });

      await controller.refreshToken(req, res, next);

      expect(mockAuthService.refreshAccessToken).toHaveBeenCalledWith('old-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh',
        expect.objectContaining({ httpOnly: true, path: '/api', maxAge: 3600 * 1000 }),
      );
      expect(res.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer new-access');
      expect(res.json).toHaveBeenCalledWith({ id_token: 'new-access' });
    });
  });

  describe('logout', () => {
    it('should clear refresh token cookie even if user missing', async () => {
      const req = { user: undefined } as AuthRequest;
      const res = createMockResponse();
      const next = createNext();

      await controller.logout(req, res, next);

      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/api' });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should call service logout when user present', async () => {
      const req = { user: { id: 5 } } as AuthRequest;
      const res = createMockResponse();
      const next = createNext();

      await controller.logout(req, res, next);

      expect(mockAuthService.logout).toHaveBeenCalledWith(5);
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/api' });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('register', () => {
    it('should create user and return 201', async () => {
      const req = { body: { login: 'jdoe', email: 'jdoe@example.com' } } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      const createdUser = { id: 1, login: 'jdoe' } as any;
      mockAuthService.register.mockResolvedValue(createdUser);

      await controller.register(req, res, next);

      expect(mockAuthService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('activate', () => {
    it('should enforce activation key requirement', async () => {
      const req = { query: {} } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.activate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Activation key required' });
      expect(mockAuthService.activateAccount).not.toHaveBeenCalled();
    });

    it('should activate account via service', async () => {
      const req = { query: { key: 'abc123' } } as Partial<Request> as Request;
      const res = createMockResponse();
      const next = createNext();

      const result = { message: 'ok' };
      mockAuthService.activateAccount.mockResolvedValue(result);

      await controller.activate(req, res, next);

      expect(mockAuthService.activateAccount).toHaveBeenCalledWith('abc123');
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });
});
