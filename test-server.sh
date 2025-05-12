#!/bin/bash

# Start server in background
echo "Starting server..."
npm start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Run functional tests
echo "Running functional tests..."
npm run test:functional

# Capture the test result
TEST_RESULT=$?

# Kill the server
echo "Shutting down server..."
kill $SERVER_PID

# Exit with the test result
exit $TEST_RESULT