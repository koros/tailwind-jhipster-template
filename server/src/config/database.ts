import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';
import { CreateInitialSchema1733000000000 } from '../migrations/1733000000000-CreateInitialSchema';

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
  migrations: process.env.NODE_ENV === 'production' ? ['dist/migrations/**/*.js'] : [CreateInitialSchema1733000000000],
  subscribers: [],
  migrationsRun: true, // Auto-run pending migrations on startup
});
