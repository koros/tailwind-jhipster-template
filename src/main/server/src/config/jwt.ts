export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  expiresIn: parseInt(process.env.JWT_EXPIRATION || '900', 10), // 15 minutes in seconds
  refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION || '604800', 10), // 7 days in seconds
};
