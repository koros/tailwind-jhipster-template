import { AppDataSource } from '../config/database';
import { UserImage } from '../entities/UserImage';
import { User } from '../entities/User';
import { AppError } from '../middleware/error.middleware';

const userImageRepository = AppDataSource.getRepository(UserImage);
const userRepository = AppDataSource.getRepository(User);

export class UserImageService {
  async uploadImage(userId: number, imageBuffer: Buffer, contentType: string) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let userImage = await userImageRepository.findOne({ where: { user: { id: userId } } });

    if (userImage) {
      userImage.image = imageBuffer;
      userImage.contentType = contentType;
    } else {
      userImage = userImageRepository.create({
        user,
        image: imageBuffer,
        contentType,
      });
    }

    return await userImageRepository.save(userImage);
  }

  async getImage(userId: number) {
    const userImage = await userImageRepository.findOne({ where: { user: { id: userId } } });
    if (!userImage) {
      throw new AppError('Image not found', 404);
    }
    return userImage;
  }

  async getImageById(id: number) {
    const userImage = await userImageRepository.findOne({ where: { id } });
    if (!userImage) {
      throw new AppError('Image not found', 404);
    }
    return userImage;
  }

  async getImageByLogin(login: string) {
    const userImage = await userImageRepository.findOne({ where: { user: { login } } });
    if (!userImage) {
      throw new AppError('Image not found', 404);
    }
    return userImage;
  }

  async deleteImage(userId: number) {
    const userImage = await userImageRepository.findOne({ where: { user: { id: userId } } });
    if (userImage) {
      await userImageRepository.remove(userImage);
    }
  }
}

export default new UserImageService();
