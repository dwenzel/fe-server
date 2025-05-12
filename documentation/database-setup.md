# Database Setup Guide

This document explains how to configure and use different database adapters with the frontend server.

## Available Database Adapters

The frontend server supports several database adapters:

1. **Memory Adapter**: In-memory storage (default, data lost on server restart)
2. **MongoDB Adapter**: For MongoDB database
3. **PostgreSQL Adapter**: For PostgreSQL database
4. **MySQL Adapter**: For MySQL database

## Configuration

Database configuration is controlled through environment variables or by modifying `src/services/database/config.js`.

### Environment Variables

Copy the `.env.example` file to `.env` and modify the settings as needed:

```bash
cp .env.example .env
```

#### Common Settings

- `DB_TYPE`: Set to 'memory', 'mongodb', 'postgresql', or 'mysql'

#### MongoDB Settings

- `MONGODB_URI`: Connection string (default: mongodb://localhost:27017/frontend-server)

#### PostgreSQL Settings

- `POSTGRES_HOST`: Host address (default: localhost)
- `POSTGRES_PORT`: Port number (default: 5432)
- `POSTGRES_DB`: Database name (default: frontend_server)
- `POSTGRES_USER`: Username (default: postgres)
- `POSTGRES_PASSWORD`: Password
- `POSTGRES_SSL`: Enable SSL (default: false)

#### MySQL Settings

- `MYSQL_HOST`: Host address (default: localhost)
- `MYSQL_PORT`: Port number (default: 3306)
- `MYSQL_DB`: Database name (default: frontend_server)
- `MYSQL_USER`: Username (default: root)
- `MYSQL_PASSWORD`: Password

## Running with Different Database Adapters

We've added npm scripts to start the server with different database adapters:

### Development Mode (with auto-reload)

```bash
# In-memory database (default)
npm run dev:memory

# MongoDB
npm run dev:mongodb

# PostgreSQL
npm run dev:postgres

# MySQL
npm run dev:mysql
```

### Production Mode

```bash
# In-memory database (default)
npm run start:memory

# MongoDB
npm run start:mongodb

# PostgreSQL
npm run start:postgres

# MySQL
npm run start:mysql
```

## Testing with Different Database Adapters

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

## Database Schema and Migration

The server automatically creates necessary collections/tables in the database when it starts. No manual schema setup is required.

### Entity Structures

#### Pages

- `id`: UUID (primary key)
- `name`: String
- `title`: String
- `isRoot`: Boolean
- `parent`: UUID (foreign key to pages.id, nullable)
- `slug`: String
- `metadata`: JSON object
- `attributes`: JSON object

#### Items

- `id`: UUID (primary key)
- `name`: String
- `parent`: UUID (foreign key to pages.id or items.id)
- `type`: String (enum)
- `content`: Text
- `attributes`: JSON object

## Troubleshooting

### Connection Issues

If you experience connection issues:

1. **MongoDB**: Ensure MongoDB server is running and accessible at the specified URI
2. **PostgreSQL**: Verify PostgreSQL server is running and credentials are correct
3. **MySQL**: Check MySQL server is running and credentials are valid

### Database Logs

Enable detailed database logs by setting environment variable:

```
LOG_LEVEL=debug
```

### Resetting Database

For development and testing, you can reset the database by:

1. MongoDB: Use `db.dropDatabase()` in MongoDB shell
2. PostgreSQL/MySQL: Drop and recreate tables
3. Memory: Simply restart the server

## Using Docker

The Docker setup supports all database adapters. Pass environment variables to the Docker container:

```bash
docker run -p 8080:8080 \
  -e DB_TYPE=mongodb \
  -e MONGODB_URI=mongodb://mongo:27017/frontend-server \
  --network my-network \
  frontend-server
```