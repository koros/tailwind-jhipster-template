import { NextFunction, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from './auth.middleware';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const verifyMock = jwt.verify as jest.Mock;

const createResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

describe('authenticateToken middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when Authorization header missing', () => {
    const req = { headers: {} } as AuthRequest;
    const res = createResponse();
    const next = createNext();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
    expect(verifyMock).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token verification fails', () => {
    const req = { headers: { authorization: 'Bearer invalid' } } as AuthRequest;
    const res = createResponse();
    const next = createNext();
    verifyMock.mockImplementationOnce(() => {
      throw new Error('invalid');
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('assigns user to request and calls next when token valid', () => {
    const req = { headers: { authorization: 'Bearer valid' } } as AuthRequest;
    const res = createResponse();
    const next = createNext();
    verifyMock.mockReturnValueOnce({ id: 4, sub: 'admin', auth: 'ROLE_ADMIN,ROLE_USER' });

    authenticateToken(req, res, next);

    expect(req.user).toEqual({ id: 4, login: 'admin', authorities: ['ROLE_ADMIN', 'ROLE_USER'] });
    expect(next).toHaveBeenCalled();
  });
});

describe('requireAdmin middleware', () => {
  it('returns 403 when user missing or lacks role', () => {
    const req = {} as AuthRequest;
    const res = createResponse();
    const next = createNext();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });

    const reqNonAdmin = { user: { id: 1, login: 'user', authorities: ['ROLE_USER'] } } as AuthRequest;
    jest.clearAllMocks();
    requireAdmin(reqNonAdmin, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when user has ROLE_ADMIN', () => {
    const req = { user: { id: 2, login: 'admin', authorities: ['ROLE_USER', 'ROLE_ADMIN'] } } as AuthRequest;
    const res = createResponse();
    const next = createNext();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
