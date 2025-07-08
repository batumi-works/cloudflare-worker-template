/**
 * Test setup for Vitest with Miniflare
 * This file runs before all tests
 */

// Set up global test environment
globalThis.TEST_ENV = 'miniflare';

// Mock console for cleaner test output
const originalConsole = globalThis.console;

// Override console methods for tests
globalThis.console = {
  ...originalConsole,
  log: (...args) => {
    // Only log in verbose test mode
    if (process.env.VERBOSE_TESTS) {
      originalConsole.log(...args);
    }
  },
  error: (...args) => {
    // Always show errors
    originalConsole.error(...args);
  },
  warn: (...args) => {
    // Show warnings only in verbose mode
    if (process.env.VERBOSE_TESTS) {
      originalConsole.warn(...args);
    }
  },
  info: (...args) => {
    // Show info only in verbose mode
    if (process.env.VERBOSE_TESTS) {
      originalConsole.info(...args);
    }
  }
};

// Set up test-specific environment variables
process.env.NODE_ENV = 'test';
process.env.ENVIRONMENT = 'test';

// Global test utilities
globalThis.createTestRequest = (url, options = {}) => {
  return new Request(url, {
    method: 'GET',
    ...options
  });
};

globalThis.createTestEnv = (overrides = {}) => {
  return {
    ENVIRONMENT: 'test',
    ...overrides
  };
};

globalThis.createTestContext = () => {
  return {
    waitUntil: (promise) => promise,
    passThroughOnException: () => {}
  };
};

// Test cleanup
export function setup() {
  // Any setup logic can go here
}

export function teardown() {
  // Restore original console
  globalThis.console = originalConsole;
}