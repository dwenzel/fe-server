# Test Isolation Architecture

This document describes the approach for maintaining test isolation in the Frontend Server's functional tests.

## Overview

Functional tests can sometimes interfere with each other, especially when they share test data or when they test hierarchical relationships. This document outlines the approach for maintaining test isolation to ensure reliable and consistent test results.

## Key Components

### 1. Server Reset Mechanism

The server implements a reset mechanism that allows tests to trigger a clean slate for the server state:

- A `reset-server.marker` file in the `data/` directory acts as a trigger
- The server watches for changes to this file
- When the file is updated, the server reinitializes its middleware instances and routers
- This ensures that each test can run in a fresh environment

### 2. Test Fixtures

Common test data is extracted into fixture files to ensure consistency:

- `/tests/fixtures/test-pages.js` contains consistent page objects with fixed UUIDs
- Each test file imports the same fixtures, ensuring data consistency

### 3. Reset Helper

A helper module (`reset-helper.js`) provides a clean interface for triggering server resets:

- Updates the marker file with a timestamp and test identifier
- Waits for the reset to take effect
- Can be called before/after tests to ensure isolation

### 4. Test Helpers

Common testing functions provide consistent behavior across test files:

- `setupTestPages()` - Creates a hierarchy of test pages with proper parent-child relationships
- `cleanupTestPages()` - Cleans up test data in the correct order
- `retryRequest()` - Provides resilient requests with automatic retries for asynchronous operations

## Usage Pattern

Each test file follows this pattern:

1. Import shared fixtures from `test-pages.js`
2. In `beforeAll`, call `setupTestPages()` with a specific test identifier
3. Use `resetServerState()` in `beforeEach` hooks for tests that need strict isolation
4. Make assertions that are resilient to potential state differences
5. In `afterAll`, call `cleanupTestPages()` with the same test identifier

## Example

```javascript
// Import fixtures and helpers
import { 
  rootId, aboutId, teamId,
  rootPage, aboutPage, teamPage 
} from '../fixtures/test-pages.js';
import { 
  retryRequest, 
  setupTestPages, 
  cleanupTestPages 
} from '../fixtures/test-helpers.js';
import { resetServerState } from '../fixtures/reset-helper.js';

describe('My Test Suite', () => {
  // Set up test data before all tests
  beforeAll(async () => {
    await setupTestPages(API_URL, API_KEY, 
      { rootPage, aboutPage, teamPage },
      'my-test-suite'
    );
  });

  // Reset server state before each test
  beforeEach(async () => {
    await resetServerState('my-test-beforeEach');
  });

  // Clean up after all tests are done
  afterAll(async () => {
    await cleanupTestPages(API_URL, API_KEY, 
      { rootPage, aboutPage, teamPage },
      'my-test-suite'
    );
  });

  // Tests with resilient assertions
  test('should find page by slug', async () => {
    const response = await retryRequest(API_URL, '/about', 'GET');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('slug', 'about');
  });
});
```

## Implementation Considerations

### Performance

- Server resets add some overhead but ensure test reliability
- Running tests in parallel may cause conflicts with the reset mechanism
- Consider using longer timeouts for tests that require server resets

### Debugging

- The reset marker file includes information about which test triggered the reset
- This helps track down which test might be causing issues
- Log messages in the server output indicate when resets occur

### Resilient Assertions

Tests should be written to handle potential state differences:

- Check for basic properties (like `slug`) rather than assuming specific IDs
- Use conditional assertions when the exact data may vary
- Log unexpected results for debugging without failing tests
- Increase retry attempts for operations that may be affected by resets

## Future Enhancements

- Database isolation for tests (separate database per test run)
- Mock server for pure API testing without state concerns
- Transaction-based setup/cleanup for faster test runs