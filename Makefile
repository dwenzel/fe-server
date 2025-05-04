.PHONY: help install docker-install start stop test test-local test-unit test-functional test-watch test-unit-watch test-functional-watch test-server test-coverage logs restart status clean dev

# Variables
DOCKER_COMPOSE = docker-compose
CONTAINER_NAME = pages-items-api
TEST_CONTAINER = pages-items-api-test

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Server commands:"
	@echo "  make install         - Install dependencies"
	@echo "  make docker-install  - Build Docker images"
	@echo "  make start           - Start the server container"
	@echo "  make dev             - Start the server in development mode with nodemon"
	@echo "  make stop            - Stop all containers"
	@echo "  make restart         - Restart containers"
	@echo "  make status          - Show container status"
	@echo "  make logs            - Show server logs"
	@echo ""
	@echo "Test commands:"
	@echo "  make test            - Run all tests in a separate container"
	@echo "  make test-local      - Run all tests locally"
	@echo "  make test-unit       - Run only unit tests"
	@echo "  make test-functional - Run only functional tests"
	@echo "  make test-watch      - Run all tests in watch mode"
	@echo "  make test-unit-watch - Run unit tests in watch mode"
	@echo "  make test-functional-watch - Run functional tests in watch mode"
	@echo "  make test-coverage   - Run tests with coverage report"
	@echo "  make test-server     - Run all tests directly in the server container"
	@echo "  make test-<name>     - Run specific test by name"
	@echo ""
	@echo "Cleanup commands:"
	@echo "  make clean           - Remove containers, volumes, and prune Docker resources"

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Install and build Docker images
docker-install:
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

# Start the container
start:
	@echo "Starting containers..."
	$(DOCKER_COMPOSE) up -d api

# Start the server directly (no container)
dev:
	@echo "Starting server in development mode..."
	npm run dev

# Stop the container
stop:
	@echo "Stopping containers..."
	$(DOCKER_COMPOSE) down

# Restart containers
restart:
	@echo "Restarting containers..."
	$(DOCKER_COMPOSE) restart

# Show container status
status:
	@echo "Container status:"
	$(DOCKER_COMPOSE) ps

# Show logs
logs:
	@echo "Server logs:"
	$(DOCKER_COMPOSE) logs -f api

# Run all tests in a separate container
test:
	@echo "Running all tests..."
	$(DOCKER_COMPOSE) up -d api
	$(DOCKER_COMPOSE) run --rm -e TEST_TYPE=all test

# Run unit tests in Docker container (no API dependency needed)
test-unit-docker:
	@echo "Running unit tests in Docker..."
	$(DOCKER_COMPOSE) run --no-deps --rm -e TEST_TYPE=unit test

# Run functional tests in Docker container (with API dependency)
test-functional-docker:
	@echo "Running functional tests in Docker..."
	$(DOCKER_COMPOSE) up -d api
	$(DOCKER_COMPOSE) run --rm -e TEST_TYPE=functional --entrypoint "/app/docker/run-functional-tests.sh" test

# Run API dependency for functional tests
start-api:
	@echo "Starting API container..."
	$(DOCKER_COMPOSE) up -d api

# Run tests locally
test-local:
	@echo "Running all tests locally..."
	npm test

# Run unit tests locally
test-unit:
	@echo "Running unit tests..."
	npm run test:unit

# Run functional tests locally
test-functional:
	@echo "Running functional tests..."
	npm run test:functional

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

# Run unit tests in watch mode
test-unit-watch:
	@echo "Running unit tests in watch mode..."
	npm run test:unit:watch

# Run functional tests in watch mode
test-functional-watch:
	@echo "Running functional tests in watch mode..."
	npm run test:functional:watch

# Run tests directly in the server container
test-server:
	@echo "Running tests in server container..."
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) npm test

# Run test coverage
test-coverage:
	@echo "Running test coverage..."
	npm run test:coverage

# Run a specific test
test-%:
	@echo "Running test $*..."
	npm test -- tests/*/$*.test.js

# Clean up
clean:
	@echo "Cleaning up..."
	$(DOCKER_COMPOSE) down -v
	docker system prune -f --filter "label=com.docker.compose.project=pages-items-api"