/**
 * Setup for unit tests
 */
import { jest, beforeAll, afterAll } from '@jest/globals';

// Set environment variables specific to unit tests
process.env.NODE_ENV = 'test';

// Configure Jest timing for unit tests (can be different from functional tests)
// Note: This runs after the global setup, so it will override the global timeout
// Unit tests should be faster than functional tests
jest.setTimeout(5000);

// This setup is for unit tests specifically
beforeAll(async () => {
  console.log('Starting unit tests...');
  
  // Reset modules before testing to ensure clean state
  jest.resetModules();
  
  // Add any additional setup needed for unit tests
  // For example:
  // - Set up mocks
  // - Initialize test data
});

afterAll(async () => {
  console.log('Finished unit tests');
  
  // Add any cleanup needed after unit tests
  // For example:
  // - Clean up mocks
  // - Reset modules
});