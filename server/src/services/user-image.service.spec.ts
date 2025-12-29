type MockUser = { id: number; login?: string };
type MockUserImage = { id: number; user: MockUser; image: Buffer; contentType: string };

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockUserImageRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn((entity: { name: string }) => {
      if (entity.name === 'User') {
        return mockUserRepository;
      }
      if (entity.name === 'UserImage') {
        return mockUserImageRepository;
      }
      throw new Error(`Unexpected repository request for ${entity.name}`);
    }),
    isInitialized: true,
  },
}));

import { UserImageService } from './user-image.service';

describe('UserImageService', () => {
  let service: UserImageService;
  const buffer = Buffer.from('image-bytes');

  beforeEach(() => {
    service = new UserImageService();
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('creates a new image when none exists', async () => {
      const mockUser: MockUser = { id: 1, login: 'demo' };
      const createdImage: MockUserImage = { id: 10, user: mockUser, image: buffer, contentType: 'image/png' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserImageRepository.findOne.mockResolvedValue(null);
      mockUserImageRepository.create.mockReturnValue(createdImage);
      mockUserImageRepository.save.mockResolvedValue({ ...createdImage });

      const result = await service.uploadImage(1, buffer, 'image/png');

      expect(mockUserImageRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        image: buffer,
        contentType: 'image/png',
      });
      expect(mockUserImageRepository.save).toHaveBeenCalledWith(createdImage);
      expect(result).toEqual(createdImage);
    });

    it('updates an existing image record', async () => {
      const mockUser: MockUser = { id: 2 };
      const existingImage: MockUserImage = { id: 5, user: mockUser, image: Buffer.from('old'), contentType: 'image/jpeg' };
      const newBuffer = Buffer.from('new-image');

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserImageRepository.findOne.mockResolvedValue(existingImage);
      mockUserImageRepository.save.mockResolvedValue(existingImage);

      const result = await service.uploadImage(2, newBuffer, 'image/webp');

      expect(existingImage.image).toBe(newBuffer);
      expect(existingImage.contentType).toBe('image/webp');
      expect(mockUserImageRepository.save).toHaveBeenCalledWith(existingImage);
      expect(result).toEqual(existingImage);
    });

    it('throws when the user cannot be found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadImage(99, buffer, 'image/png')).rejects.toThrow('User not found');
    });
  });

  describe('getters', () => {
    it('returns image for user id', async () => {
      const stored = { id: 1 };
      mockUserImageRepository.findOne.mockResolvedValue(stored);

      const result = await service.getImage(7);
      expect(mockUserImageRepository.findOne).toHaveBeenCalledWith({ where: { user: { id: 7 } } });
      expect(result).toBe(stored);
    });

    it('returns image for record id', async () => {
      const stored = { id: 55 };
      mockUserImageRepository.findOne.mockResolvedValue(stored);

      const result = await service.getImageById(55);
      expect(mockUserImageRepository.findOne).toHaveBeenCalledWith({ where: { id: 55 } });
      expect(result).toBe(stored);
    });

    it('returns image for login', async () => {
      const stored = { id: 2 };
      mockUserImageRepository.findOne.mockResolvedValue(stored);

      const result = await service.getImageByLogin('jane');
      expect(mockUserImageRepository.findOne).toHaveBeenCalledWith({ where: { user: { login: 'jane' } } });
      expect(result).toBe(stored);
    });

    it('throws when no image exists', async () => {
      mockUserImageRepository.findOne.mockResolvedValue(null);

      await expect(service.getImage(1)).rejects.toThrow('Image not found');
      await expect(service.getImageById(1)).rejects.toThrow('Image not found');
      await expect(service.getImageByLogin('missing')).rejects.toThrow('Image not found');
    });
  });

  describe('deleteImage', () => {
    it('removes the image when it exists', async () => {
      const stored = { id: 23 };
      mockUserImageRepository.findOne.mockResolvedValue(stored);

      await service.deleteImage(9);

      expect(mockUserImageRepository.findOne).toHaveBeenCalledWith({ where: { user: { id: 9 } } });
      expect(mockUserImageRepository.remove).toHaveBeenCalledWith(stored);
    });

    it('silently returns when there is nothing to delete', async () => {
      mockUserImageRepository.findOne.mockResolvedValue(null);

      await service.deleteImage(9);

      expect(mockUserImageRepository.remove).not.toHaveBeenCalled();
    });
  });
});
