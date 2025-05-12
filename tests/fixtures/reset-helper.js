/**
 * Helper for resetting server state between tests
 */
import fs from 'fs';
import path from 'path';

// Setup directory paths - use a relative path instead of import.meta.url
const dataDir = path.resolve(process.cwd(), 'data');
const resetMarkerPath = path.join(dataDir, 'reset-server.marker');

/**
 * Check if the server is running by making a request to the health endpoint
 * 
 * @param {string} apiUrl - Base URL of the API
 * @returns {Promise<boolean>} - True if server is available, false otherwise
 */
export async function isServerRunning(apiUrl = 'http://localhost:8080') {
  try {
    // Make a simple request to the API
    const response = await fetch(`${apiUrl}/api/v1/health`);
    return response.status === 200; // Check for a 200 OK status code
  } catch (err) {
    return false;
  }
}

/**
 * Start the server in a child process if it's not already running
 * 
 * @returns {Promise<boolean>} - True if server was started successfully
 */
export async function ensureServerRunning() {
  const apiUrl = process.env.API_URL || 'http://localhost:8080';

  // Check if server is already running
  console.log(`Checking if server is running at ${apiUrl}...`);
  const running = await isServerRunning(apiUrl);
  if (running) {
    console.log('Server is already running');
    return true;
  }

  console.log('Server is not running, attempting to start it...');

  // We can't start the server in a child process from within Jest tests
  // Instead we'll warn the user
  console.warn(`WARNING: Server not detected at ${apiUrl}.`);
  console.warn('Please start the server manually with one of:');
  console.warn('- npm start           # for in-memory database');
  console.warn('- npm run start:db    # for database-backed version');
  console.warn('Tests may fail if the server is not running.');

  // Try checking again after a short delay
  console.log('Waiting briefly and trying again...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Check one more time
  const retryRunning = await isServerRunning(apiUrl);
  if (retryRunning) {
    console.log('Server is now running after retry');
    return true;
  }

  console.log('Server still not running after retry');
  return false;
}

/**
 * Triggers a server reset by updating the reset marker file
 * This helps isolate tests by ensuring the server is in a clean state
 * 
 * @param {string} testName - Name of the test triggering the reset (for logging)
 * @returns {Promise<void>}
 */
export async function resetServerState(testName = 'unknown-test') {
  console.log(`resetServerState starting for test: ${testName}`);

  // Ensure the server is running first
  console.log('Ensuring server is running before reset...');
  await ensureServerRunning();

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write the current timestamp and test name to the marker file
  // This will trigger the watcher in server.js to reset middleware
  const markerContent = `${new Date().toISOString()} - ${testName}`;
  console.log(`Writing to reset marker: ${markerContent}`);
  fs.writeFileSync(resetMarkerPath, markerContent);

  // Wait for the reset to take effect
  // Note: database reset might need more time
  console.log('Waiting for server reset to take effect...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Reset wait completed');
}