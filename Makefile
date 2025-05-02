.PHONY: help install start stop test test-server test-watch logs restart status clean

# Variables
DOCKER_COMPOSE = docker-compose
CONTAINER_NAME = fe-server
TEST_CONTAINER = fe-server-test

# Default target
help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies and build Docker images"
	@echo "  make start           - Start the server container"
	@echo "  make stop            - Stop all containers"
	@echo "  make restart         - Restart containers"
	@echo "  make status          - Show container status"
	@echo "  make logs            - Show server logs"
	@echo "  make test            - Run all tests in a separate container"
	@echo "  make test-server     - Run all tests directly in the server container" 
	@echo "  make test-watch      - Run tests in watch mode"
	@echo "  make test-pages      - Run only the pages API tests"
	@echo "  make test-items      - Run only the items API tests"
	@echo "  make test-auth       - Run only the authentication tests"
	@echo "  make test-schema     - Run only the schema validation tests"
	@echo "  make test-integration - Run only the integration tests"
	@echo "  make clean           - Remove containers, volumes, and prune Docker resources"

# Install dependencies
install:
	@echo "Installing dependencies..."
	$(DOCKER_COMPOSE) build

# Start the container
start:
	@echo "Starting containers..."
	$(DOCKER_COMPOSE) up -d fe-server

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
	$(DOCKER_COMPOSE) logs -f fe-server

# Run tests in a separate container
test:
	@echo "Running tests..."
	$(DOCKER_COMPOSE) run --rm test

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	$(DOCKER_COMPOSE) run --rm test npm run test:watch

# Run tests directly in the server container
test-server:
	@echo "Running tests in server container..."
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) npm test

# Run a specific test
test-%:
	@echo "Running test $*..."
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) npm test -- tests/$*.test.js

# Clean up
clean:
	@echo "Cleaning up..."
	$(DOCKER_COMPOSE) down -v
	docker system prune -f --filter "label=com.docker.compose.project=fe-server"