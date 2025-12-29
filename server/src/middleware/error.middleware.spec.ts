import { Request, Response } from 'express';
import { AppError, errorHandler } from './error.middleware';

describe('errorHandler middleware', () => {
  const createResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  const req = {} as Request;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses AppError status code and message', () => {
    const res = createResponse();
    const err = new AppError('Not Found', 404);

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404, message: 'Not Found' }));
  });

  it('defaults to 500 for generic errors', () => {
    const res = createResponse();
    const err = new Error('Boom');

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500, message: 'Boom' }));
  });

  it('includes stack trace only in development', () => {
    const res = createResponse();
    const err = new Error('Dev stack');
    const originalEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'development';
    errorHandler(err, req, res, jest.fn());
    const devPayload = (res.json as jest.Mock).mock.calls[0][0];
    expect(devPayload.stack).toBeDefined();

    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    errorHandler(err, req, res, jest.fn());
    const testPayload = (res.json as jest.Mock).mock.calls[0][0];
    expect(testPayload.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
