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