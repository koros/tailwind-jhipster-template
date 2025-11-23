import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({ where: { login: 'admin' } });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin', 10);
    const admin = userRepository.create({
      login: 'admin',
      password: adminPassword,
      firstName: 'Administrator',
      lastName: 'Administrator',
      email: 'admin@localhost',
      activated: true,
      langKey: 'en',
      authorities: 'ROLE_USER,ROLE_ADMIN',
      createdBy: 'system',
      createdDate: new Date(),
      lastModifiedBy: 'system',
      lastModifiedDate: new Date(),
    });

    await userRepository.save(admin);
    console.log('Admin user created successfully');
    console.log('Login: admin');
    console.log('Password: admin');

    // Create regular user
    const userPassword = await bcrypt.hash('user', 10);
    const user = userRepository.create({
      login: 'user',
      password: userPassword,
      firstName: 'User',
      lastName: 'User',
      email: 'user@localhost',
      activated: true,
      langKey: 'en',
      authorities: 'ROLE_USER',
      createdBy: 'system',
      createdDate: new Date(),
      lastModifiedBy: 'system',
      lastModifiedDate: new Date(),
    });

    await userRepository.save(user);
    console.log('Regular user created successfully');
    console.log('Login: user');
    console.log('Password: user');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
