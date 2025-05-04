// noinspection JSUnresolvedReference

/**
 * Setup for functional tests
 */
import { beforeAll, afterAll } from '@jest/globals';

// Set environment variables specific to functional tests
process.env.NODE_ENV = 'test';

// This setup is for functional tests specifically
beforeAll(async () => {
  console.log('Starting functional tests...');
  console.log(`Testing against API at: ${global.API_URL}`);

  // Check API availability with retry logic
  const axios = await import('axios').catch(() => {
    console.log('Axios not installed, skipping API health check');
    return { default: null };
  });

  if (axios.default) {
    let retries = 5;
    let apiReady = false;

    while (retries > 0 && !apiReady) {
      try {
        await axios.default.get(`${global.API_URL}/health`, {
          headers: { 'X-Api-Key': global.API_KEY }
        });
        apiReady = true;
        console.log('API is available and ready for testing');
      } catch (error) {
        console.log(`API not ready, retrying... (${retries} attempts left)`);
        retries--;
        // Wait 1 second between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!apiReady) {
      console.warn('WARNING: Could not verify API availability. Tests might fail.');
    }
  }
});

afterAll(async () => {
  console.log('Finished functional tests');

  // Add any cleanup needed after functional tests,
  // For example,
  // - Clean up test data
  // - Close connections
});
