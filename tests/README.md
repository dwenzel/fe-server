# Test Organization

This project has a structured testing approach with separate test types:

## Test Types

### Unit Tests
Unit tests focus on testing individual components in isolation:
- Located in `/tests/unit/`
- Test middleware functions, utilities, and other isolated components
- Mock external dependencies like databases and APIs
- Fast execution (5 second timeout)

### Functional Tests
Functional tests focus on testing the API endpoints and their behavior:
- Located in `/tests/functional/`
- Test API endpoints through HTTP requests
- Test authentication, validation, and error handling
- Longer timeout (10 seconds) to accommodate API calls

## Running Tests

### Local Execution

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only functional tests
npm run test:functional

# Run with watch mode
npm run test:watch
npm run test:unit:watch
npm run test:functional:watch

# Run with coverage
npm run test:coverage
npm run test:unit:coverage
npm run test:functional:coverage
```

### Using Make

```bash
# Run all tests locally
make test-local

# Run unit tests locally
make test-unit

# Run functional tests locally
make test-functional

# Run tests in Docker containers
make test
make test-unit-docker
make test-functional-docker
```

## Test Setup

The tests use three setup files:
- `/tests/setup.js` - Global setup for all tests
- `/tests/unit/setup.js` - Setup specific to unit tests
- `/tests/functional/setup.js` - Setup specific to functional tests

## Docker Testing

Tests can run in a Docker container with the following features:
- Waits for the API to be available before starting tests
- Uses a health check to ensure the API is ready
- Configurable test type (unit, functional, all) via environment variable
- Proper volume mapping for test reports