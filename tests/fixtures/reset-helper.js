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
    // The health endpoint returns 404 but the server is still running
    // so we'll just check if we get any response
    const response = await fetch(`${apiUrl}/api/v1`);
    return true; // If we get any response, assume server is running
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
  const running = await isServerRunning(apiUrl);
  if (running) {
    console.log('Server is already running');
    return true;
  }
  
  console.log('Server is not running, attempting to start it...');
  
  // We can't start the server in a child process from within Jest tests
  // Instead we'll warn the user
  console.warn(`WARNING: Server not detected at ${apiUrl}.`);
  console.warn('Please start the server manually with: npm start');
  console.warn('Tests may fail if the server is not running.');
  
  // Wait 3 seconds to give user time to see the warning
  await new Promise(resolve => setTimeout(resolve, 3000));
  
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
  // Ensure the server is running first
  await ensureServerRunning();
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write the current timestamp and test name to the marker file
  // This will trigger the watcher in server.js to reset middleware
  fs.writeFileSync(
    resetMarkerPath, 
    `${new Date().toISOString()} - ${testName}`
  );

  // Wait for the reset to take effect
  await new Promise(resolve => setTimeout(resolve, 1500));
}