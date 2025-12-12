import { configureStore } from '@reduxjs/toolkit';
import loggerMiddleware from './logger-middleware';

describe('Logger Middleware', () => {
  let store;
  let consoleLogSpy;

  beforeEach(() => {
    store = configureStore({
      reducer: (state = [], action) => [...state, action],
      middleware: getDefaultMiddleware => getDefaultMiddleware().concat(loggerMiddleware),
    });
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log actions in development mode', () => {
    const action = { type: 'TEST_ACTION', payload: 'test data' };
    store.dispatch(action);
    if (DEVELOPMENT) {
      expect(consoleLogSpy).toHaveBeenCalled();
    }
  });

  it('should handle all action types', () => {
    store.dispatch({ type: 'ACTION_1' });
    store.dispatch({ type: 'ACTION_2', payload: { data: 'test' } });
    store.dispatch({ type: 'ACTION_3', error: new Error('test') });
    // Should not crash
    expect(true).toBe(true);
  });
});
