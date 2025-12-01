import crypto from 'crypto';

export class RandomUtil {
  static generateActivationKey(): string {
    return crypto.randomBytes(10).toString('hex');
  }

  static generateResetKey(): string {
    return crypto.randomBytes(10).toString('hex');
  }

  static generatePassword(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const randomBytes = crypto.randomBytes(length);
    return Array.from(randomBytes)
      .map(byte => charset[byte % charset.length])
      .join('');
  }
}
