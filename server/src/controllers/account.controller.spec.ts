import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AccountController } from './account.controller';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import mailService from '../services/mail.service.js';
import { RandomUtil } from '../utils/random.util';

type UserRepositoryMock = {
  findOne: jest.Mock;
  save: jest.Mock;
};

type QueryBuilderMock = {
  setLock: jest.Mock;
  where: jest.Mock;
  getOne: jest.Mock;
};

type QueryRunnerRepoMock = {
  createQueryBuilder: jest.Mock;
  save: jest.Mock;
};

type QueryRunnerMock = {
  connect: jest.Mock;
  startTransaction: jest.Mock;
  commitTransaction: jest.Mock;
  rollbackTransaction: jest.Mock;
  release: jest.Mock;
  manager: {
    getRepository: jest.Mock;
  };
};

jest.mock('../config/database', () => {
  const mockQueryBuilder: QueryBuilderMock = {
    setLock: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockQueryRunnerRepo: QueryRunnerRepoMock = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    save: jest.fn(),
  };

  const mockQueryRunner: QueryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      getRepository: jest.fn(() => mockQueryRunnerRepo),
    },
  };

  const mockUserRepository: UserRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  return {
    AppDataSource: {
      getRepository: jest.fn(() => mockUserRepository),
      createQueryRunner: jest.fn(() => mockQueryRunner),
    },
    __mockUserRepository: mockUserRepository,
    __mockQueryRunner: mockQueryRunner,
    __mockQueryRunnerRepo: mockQueryRunnerRepo,
    __mockQueryBuilder: mockQueryBuilder,
  };
});

jest.mock('../services/mail.service.js', () => ({
  __esModule: true,
  default: {
    sendPasswordResetEmail: jest.fn(),
  },
}));

jest.mock('../utils/random.util', () => ({
  RandomUtil: {
    generateResetKey: jest.fn(() => 'reset-key'),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const databaseMock = jest.requireMock('../config/database') as {
  __mockUserRepository: UserRepositoryMock;
  __mockQueryRunner: QueryRunnerMock;
  __mockQueryRunnerRepo: QueryRunnerRepoMock;
  __mockQueryBuilder: QueryBuilderMock;
};
const mockUserRepository = databaseMock.__mockUserRepository;
const mockQueryRunner = databaseMock.__mockQueryRunner;
const mockQueryRunnerRepo = databaseMock.__mockQueryRunnerRepo;
const mockQueryBuilder = databaseMock.__mockQueryBuilder;

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

const controller = new AccountController();
type BcryptMock = {
  compare: jest.Mock<Promise<boolean>, any[]>;
  hash: jest.Mock<Promise<string>, any[]>;
};
const mockedBcrypt = bcrypt as unknown as BcryptMock;
type MailServiceMock = {
  sendPasswordResetEmail: jest.Mock<Promise<void>, any[]>;
};
type RandomUtilMock = {
  generateResetKey: jest.Mock<string, []>;
};
const mockMailService = mailService as unknown as MailServiceMock;
const mockRandomUtil = RandomUtil as unknown as RandomUtilMock;

describe('AccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRandomUtil.generateResetKey.mockReturnValue('reset-key');
  });

  describe('getAccount', () => {
    it('returns current user when authenticated', async () => {
      const req = { user: { id: 7 } } as AuthRequest;
      const res = createMockResponse();
      const next = createNext();
      const user = {
        id: 7,
        login: 'jane',
        password: 'hash',
        authorities: 'ROLE_USER,ROLE_ADMIN',
      } as any;
      mockUserRepository.findOne.mockResolvedValueOnce(user);

      await controller.getAccount(req, res, next);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 7 } });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 7,
          login: 'jane',
          authorities: ['ROLE_USER', 'ROLE_ADMIN'],
        }),
      );
      const payload = (res.json as jest.Mock).mock.calls[0][0];
      expect(payload.password).toBeUndefined();
      expect(next).not.toHaveBeenCalled();
    });

    it('delegates to error handler when user missing', async () => {
      const req = {} as AuthRequest;
      const res = createMockResponse();
      const next = createNext();

      await controller.getAccount(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const err = (next as jest.Mock).mock.calls[0][0] as AppError;
      expect(err.statusCode).toBe(401);
    });
  });

  describe('saveAccount', () => {
    it('updates allowed fields and returns sanitized user', async () => {
      const req = {
        user: { id: 3 },
        body: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          langKey: 'fr',
          imageUrl: 'http://example.com/img.png',
        },
      } as unknown as AuthRequest;
      const res = createMockResponse();
      const next = createNext();
      const existingUser = {
        id: 3,
        login: 'jdoe',
        password: 'secret',
        authorities: 'ROLE_USER',
      } as any;
      mockUserRepository.findOne.mockResolvedValueOnce(existingUser);
      mockUserRepository.save.mockImplementationOnce(async saved => saved);

      await controller.saveAccount(req, res, next);

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          langKey: 'fr',
          imageUrl: 'http://example.com/img.png',
        }),
      );
      const payload = (res.json as jest.Mock).mock.calls[0][0];
      expect(payload.password).toBeUndefined();
      expect(payload.firstName).toBe('Jane');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('validates payload presence', async () => {
      const req = { user: { id: 5 }, body: {} } as unknown as AuthRequest;
      const res = createMockResponse();
      const next = createNext();

      await controller.changePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Current and new password required' });
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
    });

    it('rejects invalid current password', async () => {
      const req = {
        user: { id: 5 },
        body: { currentPassword: 'old', newPassword: 'newPass' },
      } as unknown as AuthRequest;
      const res = createMockResponse();
      const next = createNext();
      const user = { id: 5, login: 'jdoe', password: 'hash' } as any;
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockedBcrypt.compare.mockResolvedValueOnce(false as any);

      await controller.changePassword(req, res, next);

      const err = (next as jest.Mock).mock.calls[0][0] as AppError;
      expect(err).toBeInstanceOf(AppError);
      expect(err.statusCode).toBe(400);
    });

    it('updates password when current password matches', async () => {
      const req = {
        user: { id: 5 },
        body: { currentPassword: 'old', newPassword: 'newPass' },
      } as unknown as AuthRequest;
      const res = createMockResponse();
      const next = createNext();
      const user = { id: 5, login: 'jdoe', password: 'hash' } as any;
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockedBcrypt.compare.mockResolvedValueOnce(true as any);
      mockedBcrypt.hash.mockResolvedValueOnce('new-hash' as any);

      await controller.changePassword(req, res, next);

      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ password: 'new-hash' }));
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    it('requires email field', async () => {
      const req = { body: {} } as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.requestPasswordReset(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email required' });
    });

    it('generates reset key and sends email for active users', async () => {
      const req = { body: { email: 'User@Example.com' } } as Request;
      const res = createMockResponse();
      const next = createNext();
      const user = { id: 1, email: 'user@example.com', activated: true } as any;
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserRepository.save.mockImplementationOnce(async saved => saved);

      await controller.requestPasswordReset(req, res, next);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
      });
      expect(mockRandomUtil.generateResetKey).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ resetKey: 'reset-key' }));
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset email sent if the email exists',
      });
    });
  });

  describe('finishPasswordReset', () => {
    it('requires both reset key and new password', async () => {
      const req = { body: { newPassword: 'abc' } } as Request;
      const res = createMockResponse();
      const next = createNext();

      await controller.finishPasswordReset(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reset key and new password required' });
    });

    it('resets password when key is valid and recent', async () => {
      const req = { body: { key: 'valid-key', newPassword: 'newPass' } } as Request;
      const res = createMockResponse();
      const next = createNext();
      const lockedUser = {
        id: 1,
        login: 'user',
        resetKey: 'valid-key',
        resetDate: new Date(),
        password: 'old',
      } as any;
      mockQueryBuilder.getOne.mockResolvedValueOnce(lockedUser);
      mockedBcrypt.hash.mockResolvedValueOnce('hashed' as any);

      await controller.finishPasswordReset(req, res, next);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunnerRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed',
          resetKey: null,
          resetDate: null,
        }),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successfully' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
