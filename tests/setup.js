// Global setup for tests

// Increase the test timeout for API calls
jest.setTimeout(10000);

// Global beforeAll hook - runs once before all tests
beforeAll(async () => {
  console.log('Starting API tests...');
  
  // You could add any setup logic here, e.g., database setup,
  // test server initialization, etc.
});

// Global afterAll hook - runs once after all tests
afterAll(async () => {
  console.log('All API tests completed');
  
  // You could add any teardown logic here, e.g., database cleanup,
  // test server shutdown, etc.
});