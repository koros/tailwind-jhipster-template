import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Todo } from '../entities/Todo';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Todo],
  migrations: [],
  subscribers: [],
});
