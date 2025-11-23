export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: parseInt(process.env.JWT_EXPIRATION || '86400', 10), // 24 hours in seconds
};
