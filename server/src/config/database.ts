import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // Disabled - use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Todo],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: [],
  migrationsRun: true, // Auto-run pending migrations on startup
});
