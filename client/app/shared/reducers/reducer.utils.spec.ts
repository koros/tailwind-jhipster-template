import { serializeAxiosError } from './reducer.utils';

describe('Reducer Utils', () => {
  describe('serializeAxiosError', () => {
    it('should serialize axios error with response', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: { message: 'Error from server' },
          status: 400,
          headers: {},
        },
        message: 'Request failed',
      };
      const result = serializeAxiosError(axiosError);
      expect(result).toBe(axiosError);
    });

    it('should handle error without response', () => {
      const error = {
        message: 'Network error',
      };
      const result = serializeAxiosError(error);
      expect(result.message).toBe('Network error');
    });

    it('should handle error with string data', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: 'Error string',
          status: 500,
        },
      };
      const result = serializeAxiosError(axiosError);
      expect(result).toBeDefined();
    });

    it('should handle error with complex response data', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            type: 'validation-error',
            title: 'Validation failed',
            violations: [{ field: 'email', message: 'Invalid' }],
          },
          status: 422,
        },
      };
      const result = serializeAxiosError(axiosError);
      expect(result.response.status).toBe(422);
    });
  });
});
