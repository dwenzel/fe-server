# Frontend Server

[![Test](https://github.com/dwenzel/fe-server/actions/workflows/test.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test.yml)
[![Matrix Testing](https://github.com/dwenzel/fe-server/actions/workflows/test-matrix.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test-matrix.yml)
[![Docker Testing](https://github.com/dwenzel/fe-server/actions/workflows/docker-test.yml/badge.svg)](https://github.com/dwenzel/fe-server/actions/workflows/docker-test.yml)
[![Coverage](https://img.shields.io/badge/coverage-70%25-yellowgreen.svg)](https://github.com/dwenzel/fe-server/actions/workflows/test.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-Unlicense-blue.svg)](LICENSE)

An Express.js-based Frontend Server API to manage pages and items, with support for hierarchical routing, multiple template engines, and database persistence.

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
- Multiple database backends (MongoDB, PostgreSQL, MySQL)

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

### Database Support

The application includes built-in database support with multiple backend options:

- **In-Memory** (default): Simple in-memory storage for development and testing
- **MongoDB**: Document database support
- **PostgreSQL**: Relational database support
- **MySQL**: Relational database support

#### Configuring Database Type

We've added new npm scripts to easily switch between database adapters:

```bash
# Use in-memory database (default)
npm run start:memory

# Use MongoDB
npm run start:mongodb

# Use PostgreSQL
npm run start:postgres

# Use MySQL
npm run start:mysql
```

For development mode with auto-reload:

```bash
# Use in-memory database (default)
npm run dev:memory

# Use MongoDB
npm run dev:mongodb

# Use PostgreSQL
npm run dev:postgres

# Use MySQL
npm run dev:mysql
```

You can also configure via environment variables:

```bash
# Use in-memory database (default)
DB_TYPE=memory npm start

# Use MongoDB
DB_TYPE=mongodb MONGODB_URI=mongodb://localhost:27017/frontend-server npm start

# Use PostgreSQL
DB_TYPE=postgresql POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_DB=frontend_server POSTGRES_USER=postgres POSTGRES_PASSWORD=secret npm start

# Use MySQL
DB_TYPE=mysql MYSQL_HOST=localhost MYSQL_PORT=3306 MYSQL_DB=frontend_server MYSQL_USER=root MYSQL_PASSWORD=secret npm start
```

For detailed setup instructions, see [Database Setup Guide](./documentation/database-setup.md)

### Running with Docker

1. Build the Docker image:
   ```
   make docker-install
   ```

2. Start the containers:
   ```
   make start
   ```

### Running with Docker Compose

We provide Docker Compose configurations for each database type to easily test different database backends:

#### In-Memory Database (default)

```bash
# Start services
npm run docker:compose:memory

# Run tests
npm run docker:test:memory

# Stop services
npm run docker:compose:memory:down
```

#### MongoDB

```bash
# Start services
npm run docker:compose:mongodb

# Run tests
npm run docker:test:mongodb

# Stop services
npm run docker:compose:mongodb:down
```

#### PostgreSQL

```bash
# Start services
npm run docker:compose:postgres

# Run tests
npm run docker:test:postgres

# Stop services
npm run docker:compose:postgres:down
```

#### MySQL

```bash
# Start services
npm run docker:compose:mysql

# Run tests
npm run docker:test:mysql

# Stop services
npm run docker:compose:mysql:down
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

### Testing with Different Database Adapters

You can run functional tests with specific database adapters:

```bash
# Run functional tests with in-memory database
npm run test:memory

# Run functional tests with MongoDB
npm run test:mongodb

# Run functional tests with PostgreSQL
npm run test:postgres

# Run functional tests with MySQL
npm run test:mysql
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

## Architecture

### Database Layer

The application uses a repository pattern to abstract database interactions:

1. **Database Adapter Interface**: Defines a common interface for all database backends
2. **Repository Layer**: Provides entity-specific operations for Pages and Items
3. **Multiple Implementations**:
   - InMemoryAdapter: For development and testing
   - MongoDBAdapter: For MongoDB support
   - PostgresAdapter: For PostgreSQL support
   - MySQLAdapter: For MySQL support

See the [Database Adapters documentation](./documentation/architecture/database-adapters.md) for more details.

## Makefile Commands

Run `make help` to see all available commands.

### Database-Specific Commands

We've added a separate Makefile for database-specific operations. Run `make -f Makefile.database help-db` to see all database-specific commands:

```bash
# Start servers with specific databases
make -f Makefile.database start-memory
make -f Makefile.database start-mongodb
make -f Makefile.database start-postgres
make -f Makefile.database start-mysql

# Run tests with specific databases
make -f Makefile.database test-memory
make -f Makefile.database test-mongodb
make -f Makefile.database test-postgres
make -f Makefile.database test-mysql

# Import data to specific databases
make -f Makefile.database import-memory
make -f Makefile.database import-mongodb
make -f Makefile.database import-postgres
make -f Makefile.database import-mysql

# Development environments with all databases running
make -f Makefile.database dev-all      # Starts all databases with API server
make -f Makefile.database dev-memory   # API using in-memory database
make -f Makefile.database dev-mongodb  # API using MongoDB
make -f Makefile.database dev-postgres # API using PostgreSQL
make -f Makefile.database dev-mysql    # API using MySQL
```

## License

This project is licensed under the Unlicense - see the [LICENSE](LICENSE) file for details.