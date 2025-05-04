# Pages & Items API

An Express.js API to manage pages and items.

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

- Node.js >= 16.0.0
- npm >= 7.0.0
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pages-items-api.git
   cd pages-items-api
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

The API requires authentication using an API key provided in the `X-Api-Key` header.

### Endpoints

#### Pages

- `POST /pages` - Create a new page
- `PUT /pages/{id}` - Update a page
- `DELETE /pages/{id}` - Delete a page

#### Items

- `POST /items` - Create a new item
- `PUT /items/{id}` - Update an item
- `DELETE /items/{id}` - Delete an item

See the [OpenAPI specification](./spec/pagesAPI.yaml) for more details.

## Testing

### Running Tests

```
make test
```

Or:

```
npm test
```

### Running Tests in Watch Mode

```
make test-watch
```

Or:

```
npm run test:watch
```

### Running Specific Tests

```
make test-pages
make test-items
make test-auth
make test-schema
make test-integration
```

## Makefile Commands

Run `make help` to see all available commands.

## License

This project is licensed under the Unlicense - see the [LICENSE](LICENSE) file for details.