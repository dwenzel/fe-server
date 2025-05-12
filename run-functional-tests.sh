#!/bin/bash

# Start server in background
echo "Starting server..."
npm start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Run a single test file to test authentication changes
echo "Running functional API endpoint tests..."
npx jest tests/functional/api-endpoints.test.js

# Kill the server
echo "Shutting down server..."
kill $SERVER_PID

exit 0