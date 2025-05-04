#!/bin/sh
# Script to run functional tests with API dependency

echo "Waiting for API to be ready..."
/app/docker/wait-for-it.sh api:8080 -t 30 -- echo "API is ready"

if [ $? -ne 0 ]; then
  echo "API server is not available, cannot run functional tests"
  exit 1
fi

echo "Running functional tests..."
TEST_TYPE=functional npm test