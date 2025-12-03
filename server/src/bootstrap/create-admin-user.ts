import 'dotenv/config';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';

export async function ensureAdminUser(dataSource: DataSource) {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';

  const userRepo = dataSource.getRepository(User);
  let admin = await userRepo.findOne({ where: [{ login: adminUsername }, { email: adminEmail }] });

  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = userRepo.create({
      login: adminUsername,
      password: hashed,
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      activated: true,
      langKey: 'en',
      authorities: 'ROLE_ADMIN',
      createdBy: 'system',
      createdDate: new Date(),
      lastModifiedBy: 'system',
      lastModifiedDate: new Date(),
    });
    await userRepo.save(admin);
    // eslint-disable-next-line no-console
    console.log(`Admin user created: ${adminUsername} / ${adminEmail}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin user already exists.');
  }
}
