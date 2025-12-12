import MailService from './mail.service';
import path from 'path';

// Note: nodemailer is already mocked in test-setup.ts

describe('MailService', () => {
  describe('sendActivationEmail', () => {
    it('should send activation email successfully', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        activationKey: 'test-key-123',
        langKey: 'en',
      } as any;

      await expect(MailService.sendActivationEmail(mockUser)).resolves.not.toThrow();
    });

    it('should handle user without firstName', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        activationKey: 'test-key-123',
      } as any;

      await expect(MailService.sendActivationEmail(mockUser)).resolves.not.toThrow();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const mockUser = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        resetKey: 'reset-key-123',
      } as any;

      await expect(MailService.sendPasswordResetEmail(mockUser)).resolves.not.toThrow();
    });
  });

  describe('sendCreationEmail', () => {
    it('should send account creation email successfully', async () => {
      const mockUser = {
        id: 1,
        login: 'newuser',
        email: 'new@example.com',
        firstName: 'New',
        resetKey: 'reset-key-456',
      } as any;

      await expect(MailService.sendCreationEmail(mockUser)).resolves.not.toThrow();
    });
  });
});
