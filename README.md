# Frontend Server

[![Test](https://github.com/dwenzel/fe-server/actions/workflows/test.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test.yml)
[![Matrix Testing](https://github.com/dwenzel/fe-server/actions/workflows/test-matrix.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test-matrix.yml)
[![Docker Testing](https://github.com/dwenzel/fe-server/actions/workflows/docker-test.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/docker-test.yml)
[![Coverage](https://img.shields.io/badge/coverage-70%25-yellowgreen.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-Unlicense-blue.svg)](LICENSE)

An Express.js-based Frontend Server API to manage pages and items, with support for hierarchical routing and multiple template engines.

## API Overview

The API provides endpoints to manage pages and items with the following operations:
- Create, update, and delete pages
- Create, update, and delete items
- Items can be associated with pages or with other items

## Technologies

- Node.js
- Express.js v5 (beta)
- Jest for testing
- Docker for containerization

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dwenzel/fe-server.git
   cd fe-server
   ```

2. Install dependencies:
   ```
   make install
   ```
   
   Or manually:
   ```
   npm install
   ```

### Running the API

#### Development Mode (with auto-reload)

```
make dev
```

Or:

```
npm run dev
```

#### Production Mode

```
make start
```

Or:

```
npm start
```

### Running with Docker

1. Build the Docker image:
   ```
   make docker-install
   ```

2. Start the containers:
   ```
   make start
   ```

## API Documentation

### Authenticated API

The backend API requires authentication using an API key provided in the `X-Api-Key` header.

#### Backend Pages Endpoints

- `POST /backend/pages` - Create a new page
- `PUT /backend/pages/{id}` - Update a page
- `DELETE /backend/pages/{id}` - Delete a page

#### Backend Items Endpoints

- `POST /backend/items` - Create a new item
- `PUT /backend/items/{id}` - Update an item
- `DELETE /backend/items/{id}` - Delete an item

### Public API

The frontend API provides public read-only access without authentication.

#### Frontend Pages Endpoints

- `GET /frontend/pages` - Get all pages
- `GET /frontend/pages/{id}` - Get a specific page

#### Frontend Items Endpoints

- `GET /frontend/items` - Get all items
- `GET /frontend/items/{id}` - Get a specific item

See the [OpenAPI specification](./spec/feServerAPI.yaml) for more details.

## Hierarchical Routing and Templates

The server supports hierarchical slug-based routing for pages, allowing pages to be accessed at paths that correspond to their position in the page hierarchy:

- `/` - Root page (with `isRoot: true`)
- `/about` - First-level page with slug "about"
- `/about/team` - Second-level page with slug "team" under the "about" page
- `/products/product-x` - Second-level page under the "products" section

### Template Rendering

The server provides flexible template rendering with support for multiple template engines:

- **Handlebars** - Default template engine
- **Pug** - Alternative template engine
- **Mustache** - Alternative template engine

Content can be rendered with a specific engine by adding the `engine` query parameter:
- `?engine=handlebars`
- `?engine=pug`
- `?engine=mustache`

## Testing

### Test Types

The project has two types of tests:

- **Unit Tests**: Test individual components in isolation
- **Functional Tests**: Test API endpoints through HTTP requests, including hierarchical routing and template rendering

### Running All Tests

```
make test
```

Or:

```
npm test
```

### Running Specific Test Types

```
# Run only unit tests
make test-unit

# Run only functional tests
make test-functional

# Run tests in Docker containers
make test-unit-docker
make test-functional-docker
```

### Running Tests in Watch Mode

```
# All tests in watch mode
make test-watch

# Unit tests in watch mode
make test-unit-watch

# Functional tests in watch mode
make test-functional-watch
```

### Running Specific Test Files

For tests involving hierarchical routing and template rendering, you may want to run specific test files:

```bash
# Run hierarchical routing tests
npx jest tests/functional/hierarchical-routing.test.js

# Run template rendering tests
npx jest tests/functional/template-rendering.test.js
```

The tests use a server reset mechanism to ensure proper isolation between tests, allowing them to be run together or individually.

### Test Coverage

```
# Generate coverage report for all tests
make test-coverage

# Generate coverage for specific test types
npm run test:unit:coverage
npm run test:functional:coverage
```

Coverage reports are available in `.build/reports/coverage/`.

## CI/CD with GitHub Actions

This project includes GitHub Actions workflows for continuous integration:

- **Standard Testing Workflow** (`test.yml`): Runs unit and functional tests separately, generates coverage reports.
- **Matrix Testing Workflow** (`test-matrix.yml`): Tests different Node.js versions (20, 22) with both unit and functional tests.
- **Docker Testing Workflow** (`docker-test.yml`): Runs tests in Docker containers, simulating production environment.

The test results and coverage reports are available as artifacts in GitHub Actions.

## Makefile Commands

Run `make help` to see all available commands.

## License

This project is licensed under the Unlicense - see the [LICENSE](LICENSE) file for details.
