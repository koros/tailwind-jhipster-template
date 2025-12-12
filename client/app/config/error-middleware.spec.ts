import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './error-middleware';

describe('Error Middleware', () => {
  let store;
  let consoleErrorSpy;

  beforeEach(() => {
    store = configureStore({
      reducer: (state = [], action) => [...state, action],
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(errorMiddleware),
    });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should not trigger console.error for non-error actions', () => {
    store.dispatch({ type: 'SUCCESS_ACTION', payload: 'test' });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should trigger console.error for actions with error in development', () => {
    const errorAction = {
      type: 'ERROR_ACTION',
      error: { message: 'Something went wrong' },
    };
    store.dispatch(errorAction);
    if (DEVELOPMENT) {
      expect(consoleErrorSpy).toHaveBeenCalled();
    }
  });

  it('should handle errors with response data', () => {
    const errorAction = {
      type: 'ERROR_ACTION',
      error: {
        message: 'Request failed',
        response: {
          data: {
            message: 'Validation error',
            fieldErrors: [{ field: 'email', objectName: 'user', message: 'Invalid email' }],
          },
        },
      },
    };
    store.dispatch(errorAction);
    if (DEVELOPMENT) {
      expect(consoleErrorSpy).toHaveBeenCalled();
    }
  });
});
