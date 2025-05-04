# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Run server: `node ./server/index.mjs`
- Preview: `npm run preview` (uses nitro preview command)
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

### GitHub Actions
- Workflows defined in `.github/workflows/`
- Docker testing workflow uses `docker compose` for running tests in containers
- Test reports published as artifacts and in PR comments

## Code Style Guidelines

### General
- Project type: Nuxt 3 application with Vue 3
- Use ES Modules (import/export) syntax
- Maintain TypeScript type safety
- Follow Vue 3 Composition API patterns

### Naming Conventions
- Components: PascalCase (e.g., `PageView.vue`)
- Files/directories: kebab-case (e.g., `page-view.ts`)
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