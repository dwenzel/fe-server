.PHONY: help install start stop test test-server clean

# Variables
DOCKER_COMPOSE = docker-compose
CONTAINER_NAME = fe-server

# Default target
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies and build Docker images"
	@echo "  make start        - Start the server container"
	@echo "  make stop         - Stop all containers"
	@echo "  make test         - Run all tests in a separate container"
	@echo "  make test-server  - Run all tests directly in the server container"
	@echo "  make test-pages   - Run only the pages API tests"
	@echo "  make test-items   - Run only the items API tests"
	@echo "  make test-auth    - Run only the authentication tests"
	@echo "  make test-schema  - Run only the schema validation tests"
	@echo "  make clean        - Remove containers, volumes, and prune Docker resources"

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

# Run tests in a separate container
test:
	@echo "Running tests..."
	$(DOCKER_COMPOSE) run --rm test

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