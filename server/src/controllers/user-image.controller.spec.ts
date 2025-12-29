import { Request, Response, NextFunction } from 'express';
import { UserImageController } from './user-image.controller';
import userImageService from '../services/user-image.service';

jest.mock('../services/user-image.service', () => ({
  uploadImage: jest.fn(),
  getImage: jest.fn(),
  getImageById: jest.fn(),
}));

const mockService = userImageService as jest.Mocked<typeof userImageService>;

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

const createNext = () => jest.fn() as unknown as NextFunction;

describe('UserImageController', () => {
  const controller = new UserImageController();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('returns 400 when no file provided', async () => {
      const req = { user: { id: 1 } } as Request & { user: { id: number } };
      const res = createMockResponse();
      const next = createNext();

      await controller.upload(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
      expect(mockService.uploadImage).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('uploads file via service', async () => {
      const req = {
        user: { id: 5 },
        file: {
          buffer: Buffer.from('img'),
          mimetype: 'image/png',
        },
      } as unknown as Request & { user: { id: number }; file: Express.Multer.File };
      const res = createMockResponse();
      const next = createNext();

      await controller.upload(req, res, next);

      expect(mockService.uploadImage).toHaveBeenCalledWith(5, req.file.buffer, 'image/png');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image uploaded successfully' });
    });
  });

  describe('get', () => {
    it('fetches image for current user and streams it', async () => {
      const req = { user: { id: 8 } } as Request & { user: { id: number } };
      const res = createMockResponse();
      const next = createNext();
      const image = {
        contentType: 'image/jpeg',
        image: Buffer.from('data'),
      } as any;
      mockService.getImage.mockResolvedValueOnce(image);

      await controller.get(req, res, next);

      expect(mockService.getImage).toHaveBeenCalledWith(8);
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/jpeg');
      expect(res.send).toHaveBeenCalledWith(image.image);
    });
  });

  describe('getById', () => {
    it('fetches image by id and sets cache headers', async () => {
      const req = { params: { id: '12' } } as unknown as Request;
      const res = createMockResponse();
      const next = createNext();
      const image = {
        contentType: 'image/png',
        image: Buffer.from('data'),
      } as any;
      mockService.getImageById.mockResolvedValueOnce(image);

      await controller.getById(req, res, next);

      expect(mockService.getImageById).toHaveBeenCalledWith(12);
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=86400');
      expect(res.send).toHaveBeenCalledWith(image.image);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
