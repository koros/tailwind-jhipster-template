// Test setup file - runs before all tests
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.MAIL_FROM = 'test@example.com';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Mock nodemailer to prevent actual email sending in tests
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ accepted: ['test@example.com'], messageId: 'test-id' }),
    verify: jest.fn().mockResolvedValue(true),
  }),
}));

// Increase timeout for database operations
jest.setTimeout(10000);
