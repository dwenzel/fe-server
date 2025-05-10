/**
 * Utility function to reset the server state for tests
 */
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

// File path for the reset marker
const __filename = fileURLToPath(import.meta.url);
const resetMarkerPath = resolve(__filename, '../../data/reset-server.marker');

/**
 * Resets the server by writing a marker file
 * @returns {void}
 */
export function resetServer() {
  try {
    // Write a timestamp to the file to ensure it's modified
    writeFileSync(resetMarkerPath, `${Date.now()}`);
    return true;
  } catch (error) {
    console.error('Failed to reset server:', error);
    return false;
  }
}

export default resetServer;