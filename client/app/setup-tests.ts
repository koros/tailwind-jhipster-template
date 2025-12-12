// Mock FontAwesome to prevent icon loading errors in tests
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

jest.mock('@fortawesome/fontawesome-svg-core', () => ({
  library: {
    add: jest.fn(),
  },
  config: {
    autoAddCss: false,
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import { loadIcons } from './config/icon-loader';

loadIcons();
