# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Run server: `npm start` or `node src/index.js`
- Development mode: `npm run dev` (uses nodemon for auto-reload)
- Run all tests: `npm test`
- Run unit tests: `npm run test:unit`
- Run functional tests: `npm run test:functional`
- Run tests with coverage: `npm run test:coverage`
- Run linting: `npm run lint`
- Build Docker image: `npm run docker:build`
- Run with Docker: `npm run docker:run`

## Testing

### Unit Tests
- Tests located in `tests/unit/` directory
- Middleware tests are organized in separate files:
  - `tests/unit/middleware/pages.test.js`
  - `tests/unit/middleware/items.test.js`
  - `tests/unit/middleware/auth.test.js`
  - `tests/unit/middleware/validation.test.js`
  - `tests/unit/middleware/utils.test.js`
- Aim for 100% test coverage of middleware components

### Functional Tests
- API integration tests in `tests/functional/` directory
- Tests the API endpoints with actual HTTP requests
- Tests for hierarchical routing and template rendering use server reset mechanism for test isolation
- You can run all tests with: `npm run test:functional`
- Or run individual test files for better isolation:
  ```bash
  npx jest tests/functional/hierarchical-routing.test.js
  npx jest tests/functional/template-rendering.test.js
  ```

#### Test Fixtures
- Shared test data is defined in `tests/fixtures/test-pages.js`
- Test helper functions in `tests/fixtures/test-helpers.js`
- Server reset mechanism in `tests/fixtures/reset-helper.js`
- See documentation in `documentation/testing/test-isolation.md` for details on the test isolation architecture

### GitHub Actions
- Workflows defined in `.github/workflows/`
- Docker testing workflow uses `docker compose` for running tests in containers
- Test reports published as artifacts and in PR comments

## Code Style Guidelines

### General
- Project type: Node.js Express Frontend Server
- ES Modules (import/export) syntax
- RESTful API implementation
- Express middleware pattern for route handling
- Jest for testing
- Winston for logging

### Naming Conventions
- Classes: PascalCase (e.g., `PagesMiddleware`)
- Files/directories: kebab-case for directories, camelCase for .js files
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### API Structure
- RESTful API pattern for pages and items
- Consistent error handling (HTTP status codes)
- Authentication via X-Api-Key header
- UUID format for all IDs

### Schema Validation
- Follow OpenAPI 3.0.2 schema definitions
- Validate request/response bodies against schemas
- Respect required fields in Page/Item schemas

## Docker
- Main Dockerfile for API image
- Dockerfile.test for running tests in Docker
- Docker Compose configuration for running API and tests together
- Helper scripts in `docker/` directory for test orchestration