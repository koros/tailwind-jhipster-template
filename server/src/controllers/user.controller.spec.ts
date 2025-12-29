import { Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import userService from '../services/user.service';

jest.mock('../services/user.service', () => ({
  getAllUsers: jest.fn(),
  getUserByLogin: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getAuthorities: jest.fn(),
}));

const mockUserService = userService as jest.Mocked<typeof userService>;

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

describe('UserController', () => {
  const controller = new UserController();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('passes pagination params to service and sets header', async () => {
      const req = {
        query: { page: '1', size: '50', sort: 'login,asc' },
      } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      mockUserService.getAllUsers.mockResolvedValueOnce({ total: 3, users: [{ login: 'user1' }] } as any);

      await controller.getAllUsers(req, res, next);

      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(1, 50, 'login,asc');
      expect(res.set).toHaveBeenCalledWith('X-Total-Count', '3');
      expect(res.json).toHaveBeenCalledWith([{ login: 'user1' }]);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('retrieves user by login', async () => {
      const req = { params: { login: 'jane' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const user = { login: 'jane' } as any;
      mockUserService.getUserByLogin.mockResolvedValueOnce(user);

      await controller.getUser(req, res, next);

      expect(mockUserService.getUserByLogin).toHaveBeenCalledWith('jane');
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('createUser', () => {
    it('strips empty fields before delegating', async () => {
      const req = {
        body: {
          login: 'john',
          email: 'john@example.com',
          firstName: '',
          langKey: 'en',
        },
      } as Request;
      const res = createMockResponse();
      const next = createNext();
      const created = { id: 1, login: 'john' } as any;
      mockUserService.createUser.mockResolvedValueOnce(created);

      await controller.createUser(req, res, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith({ login: 'john', email: 'john@example.com', langKey: 'en' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('updateUser', () => {
    it('derives login from params or body and strips empty values', async () => {
      const req = {
        params: { login: 'jane' },
        body: { login: 'ignored', imageUrl: '', email: 'jane@example.com' },
      } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const updated = { login: 'jane', email: 'jane@example.com' } as any;
      mockUserService.updateUser.mockResolvedValueOnce(updated);

      await controller.updateUser(req, res, next);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('jane', expect.objectContaining({ email: 'jane@example.com' }));
      expect(res.json).toHaveBeenCalledWith(updated);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next with error when login missing', async () => {
      const req = { params: {}, body: {} } as unknown as Request;
      const res = createMockResponse();
      const nextMock = createNext();

      await controller.updateUser(req, res, nextMock);

      expect(nextMock).toHaveBeenCalledWith(expect.any(Error));
      const err = (nextMock as jest.Mock).mock.calls[0][0] as Error;
      expect(err.message).toBe('User login is required');
    });
  });

  describe('deleteUser', () => {
    it('passes login to service and returns result', async () => {
      const req = { params: { login: 'john' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const result = { message: 'deleted' } as any;
      mockUserService.deleteUser.mockResolvedValueOnce(result);

      await controller.deleteUser(req, res, next);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('john');
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  describe('getAuthorities', () => {
    it('returns authorities from service', async () => {
      const req = {} as Request;
      const res = createMockResponse();
      const next = createNext();
      mockUserService.getAuthorities.mockReturnValueOnce(['ROLE_USER', 'ROLE_ADMIN']);

      await controller.getAuthorities(req, res, next);

      expect(res.json).toHaveBeenCalledWith(['ROLE_USER', 'ROLE_ADMIN']);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
