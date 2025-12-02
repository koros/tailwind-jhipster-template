import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

// Support both DATABASE_URL and individual environment variables
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
    };
  }

  // Fallback to individual environment variables
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'myTailwindJhipster',
    password: process.env.DB_PASSWORD || 'myTailwindJhipster',
    database: process.env.DB_DATABASE || 'myTailwindJhipster',
  };
};

export const AppDataSource = new DataSource({
  ...getDatabaseConfig(),
  synchronize: false, // Disabled - use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Todo],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: [],
  migrationsRun: true, // Auto-run pending migrations on startup
});
