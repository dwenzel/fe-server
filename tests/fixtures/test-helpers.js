/**
 * Common helper functions for testing
 */
import request from 'supertest';
import { resetServerState, ensureServerRunning } from './reset-helper.js';

/**
 * Helper function for retrying API requests with delay
 * @param {string} url - API URL
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} headers - Request headers
 * @param {Object} data - Request body
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} - Response object
 */
export async function retryRequest(url, path, method = 'GET', headers = {}, data = null, maxRetries = 5) {
  let lastError;
  let response;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      let req = request(url);
      
      // Apply method
      switch (method.toUpperCase()) {
        case 'GET':
          req = req.get(path);
          break;
        case 'POST':
          req = req.post(path);
          break;
        case 'PUT':
          req = req.put(path);
          break;
        case 'DELETE':
          req = req.delete(path);
          break;
        case 'PATCH':
          req = req.patch(path);
          break;
        default:
          req = req.get(path);
      }
      
      // Apply headers
      Object.entries(headers).forEach(([key, value]) => {
        req = req.set(key, value);
      });
      
      // Send data if needed
      if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        req = req.send(data);
      }
      
      response = await req;
      return response;
    } catch (error) {
      lastError = error;
      // Wait longer before retrying (increasing backoff)
      const delayMs = 500 * (i + 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError || new Error(`Request failed after ${maxRetries} attempts`);
}

/**
 * Set up test pages and items for hierarchical routing tests
 * @param {string} apiUrl - API URL
 * @param {string} apiKey - API key
 * @param {Object} pages - Test page objects
 * @param {string} testIdentifier - Identifier for the test suite
 * @returns {Promise<void>}
 */
export async function setupTestPages(apiUrl, apiKey, pages, testIdentifier = 'setup-test-pages') {
  // First ensure server is running
  await ensureServerRunning();
  
  // Then trigger a server reset to ensure clean state
  await resetServerState(`setup-${testIdentifier}`);
  
  const {
    rootPage,
    aboutPage,
    teamPage,
    productsPage,
    productDetailPage,
    testItem
  } = pages;

  // Delete existing pages and items in reverse hierarchical order
  if (testItem) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/items/${testItem.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if item doesn't exist
    }
  }

  if (productDetailPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${productDetailPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (teamPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${teamPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (productsPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${productsPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (aboutPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${aboutPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (rootPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${rootPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  // Create new pages in hierarchical order (root, then child, then grandchild)
  if (rootPage) {
    await retryRequest(apiUrl, '/api/v1/backend/pages', 'POST', 
      { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, 
      rootPage
    );
    // Wait a bit for the server to process the root page
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Create first level pages
  const firstLevelPages = [];
  if (aboutPage) firstLevelPages.push(aboutPage);
  if (productsPage) firstLevelPages.push(productsPage);
  
  for (const page of firstLevelPages) {
    await retryRequest(apiUrl, '/api/v1/backend/pages', 'POST', 
      { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, 
      page
    );
  }
  
  // Wait a bit for the server to process first level pages
  if (firstLevelPages.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Create second level pages
  const secondLevelPages = [];
  if (teamPage) secondLevelPages.push(teamPage);
  if (productDetailPage) secondLevelPages.push(productDetailPage);
  
  for (const page of secondLevelPages) {
    await retryRequest(apiUrl, '/api/v1/backend/pages', 'POST', 
      { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, 
      page
    );
  }

  // Create test items
  if (testItem) {
    await retryRequest(apiUrl, '/api/v1/backend/items', 'POST', 
      { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' }, 
      testItem
    );
  }
  
  // Wait a bit for the server to fully process all pages and items
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Clean up test pages and items
 * @param {string} apiUrl - API URL
 * @param {string} apiKey - API key
 * @param {Object} pages - Test page objects
 * @param {string} testIdentifier - Identifier for the test suite
 * @returns {Promise<void>}
 */
export async function cleanupTestPages(apiUrl, apiKey, pages, testIdentifier = 'cleanup-test-pages') {
  const {
    rootPage,
    aboutPage,
    teamPage,
    productsPage,
    productDetailPage,
    testItem
  } = pages;

  // Delete pages and items in reverse hierarchical order
  if (testItem) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/items/${testItem.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if item doesn't exist
    }
  }

  if (productDetailPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${productDetailPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (teamPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${teamPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (productsPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${productsPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (aboutPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${aboutPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }

  if (rootPage) {
    try {
      await retryRequest(apiUrl, `/api/v1/backend/pages/${rootPage.id}`, 'DELETE', 
        { 'X-Api-Key': apiKey }
      );
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
  }
  
  // Trigger a server reset after cleanup to ensure a clean state for next tests
  await resetServerState(`cleanup-${testIdentifier}`);
}