/**
 * Global setup file for Jest tests
 * This file runs before each test file
 */

// Increase the test timeout for API calls
jest.setTimeout(10000);

// Set global variables if not already set in the environment
if (!global.API_URL) {
  global.API_URL = process.env.API_URL || 'http://localhost:8080';
}

if (!global.API_KEY) {
  global.API_KEY = process.env.API_KEY || 'test-api-key';
}

// Add global beforeAll hook - runs once before all tests
beforeAll(async () => {
  console.log('Starting API tests...');
  console.log(`API URL: ${global.API_URL}`);

  // You could add setup logic here:
  // - Check if API is accessible
  // - Set up test database
  // - Create test data that's needed for all tests
});

// Add global afterAll hook - runs once after all tests
afterAll(async () => {
  console.log('All API tests completed');

  // You could add teardown logic here:
  // - Clean up test data
  // - Close connections
});

// Optional: Add global error handler for better error messages
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
