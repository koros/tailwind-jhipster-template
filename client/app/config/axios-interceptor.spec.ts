import axios from 'axios';
import { Storage } from 'react-jhipster';
import setupAxiosInterceptors from './axios-interceptor';

describe('Axios Interceptor', () => {
  let onUnauthenticated;

  beforeEach(() => {
    onUnauthenticated = jest.fn();
    // Clear any existing interceptors
    axios.interceptors.request.handlers = [];
    axios.interceptors.response.handlers = [];
    // Remove tokens by setting to null
    Storage.local.set('jhi-authenticationToken', null);
    Storage.session.set('jhi-authenticationToken', null);
    setupAxiosInterceptors(onUnauthenticated);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists in local storage', async () => {
      Storage.local.set('jhi-authenticationToken', 'test-token-123');

      const config = {
        url: '/api/test',
        headers: {} as any,
      };

      const interceptor = axios.interceptors.request.handlers[0];
      const result = await interceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });

    it('should add Authorization header when token exists in session storage', () => {
      Storage.session.set('jhi-authenticationToken', 'session-token-456');

      const config = {
        url: '/api/test',
        headers: {} as any,
      };

      const interceptor = axios.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe('Bearer session-token-456');
    });

    it('should not add Authorization header when no token exists', () => {
      const config = {
        url: '/api/test',
        headers: {} as any,
      };

      const interceptor = axios.interceptors.request.handlers[0];
      const result = interceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful response', () => {
      const response = { data: { message: 'success' }, status: 200 };

      const interceptor = axios.interceptors.response.handlers[0];
      const result = interceptor.fulfilled(response);

      expect(result).toBe(response);
    });

    it('should reject errors normally', async () => {
      const error = {
        status: 500,
        response: { status: 500 },
        config: { url: '/api/test', headers: {} },
      };

      const interceptor = axios.interceptors.response.handlers[0];

      await expect(interceptor.rejected(error)).rejects.toEqual(error);
    });
  });

  describe('Axios Defaults', () => {
    it('should set axios defaults', () => {
      expect(axios.defaults.timeout).toBe(60000);
      expect(axios.defaults.withCredentials).toBe(true);
    });
  });
});
