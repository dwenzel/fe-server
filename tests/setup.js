/**
 * Global setup file for Jest tests
 * This file runs before each test file
 */

// Increase the test timeout for API calls
import {jest,beforeAll, afterAll} from "@jest/globals";

jest.setTimeout(10000);

// Set global variables if not already set in the environment
// noinspection JSUnresolvedReference
if (!global.API_URL) {
  global.API_URL = process.env.API_URL || 'http://localhost:8080';
}

// noinspection JSUnresolvedReference
if (!global.API_KEY) {
  global.API_KEY = process.env.API_KEY || 'test-api-key';
}

// Add global beforeAll hook - runs once before all tests
beforeAll(async () => {
  console.log('Starting tests...');
  // noinspection JSUnresolvedReference
    console.log(`API URL: ${global.API_URL}`);
});

// Add global afterAll-hook - runs once after all tests
afterAll(async () => {
  console.log('All tests completed');
});

// Optional: Add global error handler for better error messages
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
