/**
 * Test utilities for functional tests
 */
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resetMarkerPath = path.resolve(__dirname, '../../data/reset-server.marker');

/**
 * Resets the server by writing to the reset marker file
 */
export async function resetServer() {
  try {
    // Write current timestamp to ensure file is modified
    fs.writeFileSync(resetMarkerPath, `${Date.now()}`);
    
    // Wait a bit for the server to reset
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Failed to reset server:', error);
    return false;
  }
}

/**
 * Utility function to retry API requests with delay
 * @param {string} url - URL to request
 * @param {Object} options - Request options
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise<Object>} - Response object
 */
export async function retryRequest(url, options = {}, maxRetries = 3, delayMs = 500) {
  const API_URL = process.env.API_URL || 'http://localhost:8080';
  let lastError;
  
  // Configure request
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const data = options.data || null;
  
  // Try the request with retries
  for (let i = 0; i < maxRetries; i++) {
    try {
      let req = request(API_URL);
      
      // Apply method
      switch (method.toUpperCase()) {
        case 'GET':
          req = req.get(url);
          break;
        case 'POST':
          req = req.post(url);
          break;
        case 'PUT':
          req = req.put(url);
          break;
        case 'DELETE':
          req = req.delete(url);
          break;
        case 'PATCH':
          req = req.patch(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      // Apply headers
      Object.entries(headers).forEach(([key, value]) => {
        req = req.set(key, value);
      });
      
      // Send data if available
      if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
        req = req.send(data);
      }
      
      return await req;
    } catch (error) {
      lastError = error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError || new Error(`Failed to ${method} ${url} after ${maxRetries} attempts`);
}