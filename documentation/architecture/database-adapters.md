# Database Adapters Architecture

This document outlines the architecture and design patterns used for database integration in the Frontend Server application.

## Overview

The database layer is designed with flexibility in mind, allowing the application to work with multiple database backends. This is achieved through a well-defined abstraction layer that separates the application logic from the specifics of database interactions.

## Key Components

### 1. Database Adapter Interface

The core of the architecture is the `DatabaseAdapter` interface that defines common operations:

```javascript
export class DatabaseAdapter {
  async connect() { /* ... */ }
  async disconnect() { /* ... */ }
  async create(collection, data) { /* ... */ }
  async read(collection, id) { /* ... */ }
  async update(collection, id, data) { /* ... */ }
  async delete(collection, id) { /* ... */ }
  async find(collection, query, options) { /* ... */ }
  async exists(collection, id) { /* ... */ }
  async beginTransaction() { /* ... */ }
  async commitTransaction(transaction) { /* ... */ }
  async rollbackTransaction(transaction) { /* ... */ }
}
```

All database adapters must implement this interface to ensure consistent behavior regardless of the underlying database technology.

### 2. Repository Pattern

A repository layer sits above the database adapters, providing entity-specific operations:

```javascript
export class Repository {
  constructor(entityType, adapter) { /* ... */ }
  async create(data) { /* ... */ }
  async getById(id) { /* ... */ }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
  async getAll(query, options) { /* ... */ }
  async exists(id) { /* ... */ }
}

// Entity-specific repositories extend the base Repository
export class PagesRepository extends Repository {
  constructor(adapter) {
    super('pages', adapter);
  }
  
  async findRootPage() { /* ... */ }
  async findChildPages(parentId) { /* ... */ }
  async hasChildren(pageId) { /* ... */ }
}
```

### 3. Database Adapters

The system includes the following adapter implementations:

- **InMemoryAdapter**: Uses JavaScript Map objects for in-memory storage
- **MongoDBAdapter**: Connects to MongoDB using the native MongoDB driver
- **PostgresAdapter**: Connects to PostgreSQL using the pg driver
- **MySQLAdapter**: Connects to MySQL using the mysql2 driver

### 4. Configuration

Database configuration is handled through a combination of environment variables and default values:

```javascript
// Default configuration with environment variable fallbacks
const dbConfig = {
  type: process.env.DB_TYPE || 'memory',
  mongodb: { /* MongoDB specific config */ },
  postgresql: { /* PostgreSQL specific config */ },
  mysql: { /* MySQL specific config */ },
  memory: { /* In-memory specific config */ }
};
```

### 5. Factory Functions

Factory functions simplify the creation of database components:

```javascript
// Create the appropriate adapter based on configuration
export async function createDatabaseAdapter(type, config) { /* ... */ }

// Create repositories with a shared adapter
export async function createRepositories(config = null) { /* ... */ }
```

## Data Flow

1. The application initializes by creating repositories through the factory function
2. The factory creates the appropriate adapter based on configuration
3. The adapter connects to the database
4. Middleware uses repositories to perform database operations
5. Repositories delegate to the adapter for actual database interaction
6. Adapters translate generic operations to database-specific commands

## Transaction Support

All adapters implement transaction support, though the behavior varies by database:

- **MongoDB**: Uses sessions for transactions
- **PostgreSQL/MySQL**: Uses SQL BEGIN/COMMIT/ROLLBACK commands
- **InMemoryAdapter**: Uses snapshots for rollback capability

## Error Handling

Adapters handle database-specific errors and translate them to consistent error messages. All database operations are async and use try/catch blocks to handle errors gracefully.

## Migration Utilities

The architecture includes utilities for:

1. Migrating data between different database backends
2. Exporting/importing data to/from JSON
3. Initializing database schemas for SQL databases

## Usage Examples

### Initializing the Database

```javascript
import { initializeDatabase } from './services/database/index.js';

// Initialize database and get repositories
const { pages, items, adapter } = await initializeDatabase();
```

### Using Repositories

```javascript
// Create a new page
const pageId = await pagesRepository.create({
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Home Page',
  isRoot: true,
  slug: ''
});

// Find all child pages
const childPages = await pagesRepository.findChildPages(parentId);
```

## Testing

The InMemoryAdapter is particularly useful for testing, as it provides a fast, isolated environment without external dependencies. Tests can configure the in-memory adapter with specific test data.