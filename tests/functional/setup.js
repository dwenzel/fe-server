// noinspection JSUnresolvedReference

/**
 * Setup for functional tests
 */
import { beforeAll, afterAll } from '@jest/globals';
import { ensureServerRunning, resetServerState } from '../fixtures/reset-helper.js';

// Set environment variables specific to functional tests
process.env.NODE_ENV = 'test';

// This setup is for functional tests specifically
beforeAll(async () => {
  console.log('Starting functional tests...');
  console.log(`Testing against API at: ${global.API_URL}`);

  // Ensure server is running and reset state before any tests
  try {
    await ensureServerRunning();
    await resetServerState('functional-test-setup');
    console.log('Server is ready for testing');
  } catch (error) {
    console.warn('WARNING: Could not properly initialize server. Tests might fail.');
    console.error(error);
  }
});

afterAll(async () => {
  console.log('Finished functional tests');
  
  // Reset server state after all tests
  try {
    await resetServerState('functional-test-cleanup');
  } catch (error) {
    console.warn('WARNING: Could not reset server state after tests.');
  }
});
