import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { ensureAdminUser } from './create-admin-user';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-admin'),
}));

const mockHash = bcrypt.hash as jest.Mock;

describe('ensureAdminUser', () => {
  const originalEnv = process.env;
  let dataSource: DataSource;
  let repository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    process.env = { ...originalEnv };
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    dataSource = {
      getRepository: jest.fn().mockReturnValue(repository),
    } as unknown as DataSource;
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('creates an admin user when none exists', async () => {
    process.env.ADMIN_USERNAME = 'root';
    process.env.ADMIN_PASSWORD = 'secret';
    process.env.ADMIN_EMAIL = 'root@example.com';
    repository.findOne.mockResolvedValue(null);
    repository.create.mockReturnValue({ login: 'root' });

    await ensureAdminUser(dataSource);

    expect(mockHash).toHaveBeenCalledWith('secret', 10);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        login: 'root',
        email: 'root@example.com',
        activated: true,
        authorities: 'ROLE_ADMIN',
      }),
    );
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ login: 'root' }));
  });

  it('skips creation when admin already exists', async () => {
    const existingUser = { id: 1, login: 'admin' };
    repository.findOne.mockResolvedValue(existingUser);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await ensureAdminUser(dataSource);

    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Admin user already exists.');

    logSpy.mockRestore();
  });
});
