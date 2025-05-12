#!/bin/bash

# import-with-docker.sh - Script to import data into a running docker server
# This script starts a server with the specified database type and imports test data

# Default values
DB_TYPE="memory"
HOST="http://api"
PORT="8080"
API_KEY="test-api-key"
PAGES_FILE="../tests/fixtures/pages.json"
ITEMS_FILE="../tests/fixtures/items.json"

# Help function
function show_help {
  echo "Usage: $0 [OPTIONS]"
  echo
  echo "OPTIONS:"
  echo "  --db-type TYPE    Database type (memory, mongodb, postgres, mysql)"
  echo "  --host HOST       API host (default: http://api)"
  echo "  --port PORT       API port (default: 8080)"
  echo "  --key KEY         API key (default: test-api-key)"
  echo "  --pages FILE      Path to pages fixture file"
  echo "  --items FILE      Path to items fixture file"
  echo "  --help            Show this help message"
  echo
  echo "EXAMPLES:"
  echo "  $0 --db-type mongodb"
  echo "  $0 --db-type postgres --key my-api-key"
  echo
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --db-type)
      DB_TYPE="$2"
      shift 2
      ;;
    --host)
      HOST="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --key)
      API_KEY="$2"
      shift 2
      ;;
    --pages)
      PAGES_FILE="$2"
      shift 2
      ;;
    --items)
      ITEMS_FILE="$2"
      shift 2
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Validate DB_TYPE
if [[ ! "$DB_TYPE" =~ ^(memory|mongodb|postgres|mysql)$ ]]; then
  echo "Error: Invalid database type: $DB_TYPE"
  echo "Valid types are: memory, mongodb, postgres, mysql"
  exit 1
fi

echo "Starting import process with $DB_TYPE database..."

# Determine which docker-compose file to use based on DB_TYPE
COMPOSE_FILE="docker-compose.import.yml"
ENV_VARS="-e DB_TYPE=$DB_TYPE"

# Add additional environment variables based on DB_TYPE
case $DB_TYPE in
  mongodb)
    ENV_VARS="$ENV_VARS -e MONGODB_URI=mongodb://mongodb:27017/fe-server"
    docker-compose -f docker-compose.mongodb.yml up -d mongodb
    # Wait for MongoDB to be ready
    sleep 5
    ;;
  postgres)
    ENV_VARS="$ENV_VARS -e POSTGRESQL_HOST=postgres -e POSTGRESQL_PORT=5432 -e POSTGRESQL_USER=postgres -e POSTGRESQL_PASSWORD=postgres -e POSTGRESQL_DATABASE=fe_server"
    docker-compose -f docker-compose.postgres.yml up -d postgres
    # Wait for PostgreSQL to be ready
    sleep 5
    ;;
  mysql)
    ENV_VARS="$ENV_VARS -e MYSQL_HOST=mysql -e MYSQL_PORT=3306 -e MYSQL_USER=fe_server -e MYSQL_PASSWORD=fe_server -e MYSQL_DATABASE=fe_server"
    docker-compose -f docker-compose.mysql.yml up -d mysql
    # Wait for MySQL to be ready
    sleep 5
    ;;
esac

# Start the API server with the specified database type
echo "Starting API server with $DB_TYPE database..."
docker-compose -f $COMPOSE_FILE up -d api 

# Wait for the API server to be ready
echo "Waiting for API server to be ready..."
sleep 5

# Run the import container
echo "Running data import..."
docker-compose -f $COMPOSE_FILE run $ENV_VARS import node tools/import-data.js --host $HOST --port $PORT --key $API_KEY 

# Clean up
echo "Cleaning up containers..."
docker-compose -f $COMPOSE_FILE down

# If using a database other than memory, shut down the database container
case $DB_TYPE in
  mongodb)
    docker-compose -f docker-compose.mongodb.yml down
    ;;
  postgres)
    docker-compose -f docker-compose.postgres.yml down
    ;;
  mysql)
    docker-compose -f docker-compose.mysql.yml down
    ;;
esac

echo "Import process completed."