import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

// Separate DataSource for migrations CLI
export const MigrationDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [User, Todo],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
