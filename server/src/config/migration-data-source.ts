import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

// Reuse same env var strategy as runtime DataSource
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
    };
  }

  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'myTailwindJhipster',
    password: process.env.DB_PASSWORD || 'myTailwindJhipster',
    database: process.env.DB_DATABASE || 'myTailwindJhipster',
  };
};

// Separate DataSource for migrations CLI
export const MigrationDataSource = new DataSource({
  ...getDatabaseConfig(),
  synchronize: false,
  logging: true,
  entities: [User, Todo],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
