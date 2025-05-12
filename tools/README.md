# Developer Tools

This directory contains tools for developers working with the frontend server.

## Import Data Tool

A utility for importing test fixture data into a running server instance.

### Prerequisites

This tool requires `node-fetch` to make HTTP requests. Install it with:

```bash
npm install --save-dev node-fetch
```

### Usage

Run the tool with Node.js:

```bash
node tools/import-data.js [options]
```

Or directly (if you've made it executable):

```bash
./tools/import-data.js [options]
```

### Options

- `--host`: Server host (default: http://localhost)
- `--port`: Server port (default: 8080)
- `--key`: API key (default: test-api-key)
- `--pages`: Path to pages fixture file (default: tests/fixtures/pages.json)
- `--items`: Path to items fixture file (default: tests/fixtures/items.json)

### Examples

Import data to the default local server:

```bash
node tools/import-data.js
```

Import data to a custom server:

```bash
node tools/import-data.js --host http://dev-server --port 3000 --key your-api-key
```

Use custom fixture files:

```bash
node tools/import-data.js --pages ./custom-pages.json --items ./custom-items.json
```

### What it Does

1. Loads the page and item fixtures from the specified JSON files
2. Imports all pages first (since items may reference pages as parents)
3. Imports all items
4. Provides a summary of the import results

The tool sends data using POST requests to the `/api/pages` and `/api/items` endpoints, providing the API key in the `X-Api-Key` header.

## Import with Docker Tool

A shell script that helps with importing data to servers running in Docker containers with different database backends.

### Usage

Run the script directly:

```bash
./tools/import-with-docker.sh [options]
```

Or using the npm scripts:

```bash
# Use in-memory database (default)
npm run import-data:docker

# Use MongoDB
npm run import-data:docker:mongodb

# Use PostgreSQL
npm run import-data:docker:postgres

# Use MySQL
npm run import-data:docker:mysql
```

### Options

- `--db-type`: Database type (memory, mongodb, postgres, mysql)
- `--host`: API host (default: http://api)
- `--port`: API port (default: 8080)
- `--key`: API key (default: test-api-key)
- `--pages`: Path to pages fixture file
- `--items`: Path to items fixture file
- `--help`: Show help message

### Examples

Import data with MongoDB:

```bash
./tools/import-with-docker.sh --db-type mongodb
```

Import data with PostgreSQL and a custom API key:

```bash
./tools/import-with-docker.sh --db-type postgres --key my-api-key
```

### What it Does

1. Starts a database container based on the specified database type
2. Starts the API server container configured to use the specified database
3. Runs the import container to import test data
4. Cleans up containers when finished

This tool is particularly useful for testing the server with different database backends and ensuring data persistence works correctly across database types.