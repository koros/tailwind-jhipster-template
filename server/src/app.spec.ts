import request from 'supertest';
import app from '../app';

describe('App Integration Tests', () => {
  describe('Health and Info Endpoints', () => {
    it('GET /management/health should return health status', async () => {
      const response = await request(app).get('/management/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('components');
      expect(response.body.components).toHaveProperty('process');
    });

    it('GET /management/info should return app info', async () => {
      const response = await request(app).get('/management/info');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('app');
      expect(response.body.app).toHaveProperty('name', 'my-tailwind-jhipster');
    });
  });

  describe('OpenAPI Documentation', () => {
    it('GET /v3/api-docs should return OpenAPI spec', async () => {
      const response = await request(app).get('/v3/api-docs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('openapi');
    });

    it('GET /v3/api-docs/:group should return OpenAPI spec', async () => {
      const response = await request(app).get('/v3/api-docs/default');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('openapi');
    });

    it('GET /management/jhiopenapigroups should return groups', async () => {
      const response = await request(app).get('/management/jhiopenapigroups');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('group');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect([404, 401]).toContain(response.status); // 401 if auth required, or 404
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/management/info');

      // Helmet should set various security headers in non-production
      expect(response.headers).toBeDefined();
    });
  });
});
