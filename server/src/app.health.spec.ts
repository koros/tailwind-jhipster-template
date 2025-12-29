import request from 'supertest';

const buildDataSourceMock = (
  overrides: Partial<{
    isInitialized: boolean;
    query: jest.Mock;
    options: Record<string, unknown>;
  }> = {},
) => ({
  isInitialized: true,
  query: jest.fn(),
  options: { type: 'postgres' },
  getRepository: jest.fn(),
  ...overrides,
});

describe('App health endpoint datasource branches', () => {
  const originalEnv = process.env;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  it('reports database UP when the datasource is initialized', async () => {
    jest.doMock('./config/database', () => ({
      AppDataSource: buildDataSourceMock({
        query: jest.fn().mockResolvedValueOnce(undefined),
        options: {
          type: 'postgres',
          url: 'postgres://user:pass@health-db:5432/appdb',
        },
      }),
    }));

    const { default: app } = await import('./app');
    const response = await request(app).get('/management/health');

    expect(response.status).toBe(200);
    expect(response.body.components.db).toEqual(
      expect.objectContaining({
        status: 'UP',
        details: expect.objectContaining({
          host: 'health-db',
          port: '5432',
          database: 'appdb',
          initialized: true,
        }),
      }),
    );
  });

  it('reports database DOWN when the ping fails', async () => {
    jest.doMock('./config/database', () => ({
      AppDataSource: buildDataSourceMock({
        query: jest.fn().mockRejectedValueOnce(new Error('ping failed')),
      }),
    }));

    const { default: app } = await import('./app');
    const response = await request(app).get('/management/health');

    expect(response.status).toBe(200);
    expect(response.body.components.db).toEqual(
      expect.objectContaining({
        status: 'DOWN',
        details: expect.objectContaining({ error: 'ping failed' }),
      }),
    );
  });
});
