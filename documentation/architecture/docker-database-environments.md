# Docker Database Environments

This document explains how to use the Docker Compose configurations for working with different database backends.

## Available Environments

We provide Docker Compose files for each supported database:

- **docker-compose.memory.yml**: In-memory database (default)
- **docker-compose.mongodb.yml**: MongoDB database
- **docker-compose.postgres.yml**: PostgreSQL database
- **docker-compose.mysql.yml**: MySQL database
- **docker-compose.dev.yml**: All databases running together, with API switchable via environment variable

## Running Environments

### Individual Database Environments

Each environment can be started with the corresponding npm script:

```bash
# Memory database
npm run docker:compose:memory

# MongoDB
npm run docker:compose:mongodb

# PostgreSQL
npm run docker:compose:postgres

# MySQL
npm run docker:compose:mysql
```

Stop the environments with the corresponding "down" command:

```bash
npm run docker:compose:memory:down
npm run docker:compose:mongodb:down
npm run docker:compose:postgres:down
npm run docker:compose:mysql:down
```

### Development Environment

The development environment starts all databases at once and allows you to switch between them without restarting containers:

```bash
# Start with default (memory) database
npm run docker:compose:dev

# Start with specific database
npm run docker:compose:dev:memory
npm run docker:compose:dev:mongodb
npm run docker:compose:dev:postgres
npm run docker:compose:dev:mysql

# Stop the development environment
npm run docker:compose:dev:down
```

## Running Tests

You can run tests against each database environment:

```bash
npm run docker:test:memory
npm run docker:test:mongodb
npm run docker:test:postgres
npm run docker:test:mysql
```

## Importing Data

The import tool can be used with any database type:

```bash
npm run import-data:docker
npm run import-data:docker:memory
npm run import-data:docker:mongodb
npm run import-data:docker:postgres
npm run import-data:docker:mysql
```

For more control, use the script directly:

```bash
./tools/import-with-docker.sh --db-type mongodb --key custom-api-key
```

## Makefile Commands

For convenience, all operations can be performed with Makefile commands:

```bash
make -f Makefile.database help-db    # Show all database commands
make -f Makefile.database start-mongodb
make -f Makefile.database stop-mongodb
make -f Makefile.database test-mongodb
make -f Makefile.database import-mongodb
make -f Makefile.database dev-mongodb
```

## Architecture

Each Docker Compose file sets up the necessary containers:

1. **API Server**: Node.js application with environment variables for database configuration
2. **Database Server**: Running the selected database engine
3. **Test Container**: For running functional tests against the API

The development environment (`docker-compose.dev.yml`) runs all database containers simultaneously and configures the API server to connect to the selected database via the `DB_TYPE` environment variable.

## Container Networking

Each environment creates a dedicated network to isolate the containers. The API server is accessible on port 8080 from the host machine, and the database servers are accessible on their standard ports:

- MongoDB: 27017
- PostgreSQL: 5432
- MySQL: 3306

## Data Persistence

Database data is stored in Docker volumes to ensure persistence across container restarts:

- `mongodb_data`
- `postgres_data`
- `mysql_data`

## Customization

To customize the database configuration, edit the environment variables in the corresponding Docker Compose file or provide them when starting the containers:

```bash
MONGODB_URI=mongodb://custom-host:27017/custom-db npm run docker:compose:dev:mongodb
```