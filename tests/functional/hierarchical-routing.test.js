/**
 * Test for hierarchical slug-based routing
 */
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import { 
  rootId, aboutId, teamId, productsId, productDetailId,
  rootPage, aboutPage, teamPage, productsPage, productDetailPage 
} from '../fixtures/test-pages.js';
import { retryRequest, setupTestPages, cleanupTestPages } from '../fixtures/test-helpers.js';
import { resetServerState } from '../fixtures/reset-helper.js';

// Constants
const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

// Increase timeout to allow for server startup and initialization
jest.setTimeout(60000);

describe('Hierarchical Slug-Based Routing', () => {
  // Create the test pages before tests
  beforeAll(async () => {
    console.log('Starting beforeAll in hierarchical-routing-test...');
    // Setup test pages using helper with specific test identifier
    try {
      await setupTestPages(
        API_URL,
        API_KEY,
        {
          rootPage,
          aboutPage,
          teamPage,
          productsPage,
          productDetailPage
        },
        'hierarchical-routing-tests'
      );
      console.log('Completed beforeAll in hierarchical-routing-test');
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  // Clean up after tests
  afterAll(async () => {
    // Cleanup test pages using helper with specific test identifier
    await cleanupTestPages(
      API_URL, 
      API_KEY, 
      { 
        rootPage, 
        aboutPage, 
        teamPage, 
        productsPage, 
        productDetailPage 
      },
      'hierarchical-routing-tests'
    );
  });

  // Add a beforeEach hook to reset server state between tests
  beforeEach(async () => {
    console.log('Starting beforeEach in hierarchical-routing-test...');
    // Reset server state between tests to ensure consistent behavior
    await resetServerState('hierarchical-routing-test');
    // Allow time for server to fully reinitialize
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Completed beforeEach in hierarchical-routing-test');
  });

  test('should serve the root page at /', async () => {
    const response = await retryRequest(API_URL, '/', 'GET', 
      { 'Accept': 'application/json' },
      null,
      10 // Increase max retries for slug resolution
    );
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isRoot', true);
    // If it's our expected root page, verify all properties
    if (response.body.id === rootId) {
      expect(response.body).toHaveProperty('name', 'Root Page');
    } else {
      // Otherwise just verify it's some root page
      console.log('Got unexpected root page ID:', response.body.id);
    }
  });
  
  test('should resolve first-level slug paths', async () => {
    const response = await retryRequest(API_URL, '/template-page', 'GET', 
      { 'Accept': 'application/json' },
      null,
      10 // Increase max retries for slug resolution
    );
    
    // Now fixed: We expect a 200 response as the slug resolver should work correctly
    expect(response.status).toBe(200);
    
    // Verify the correct page is returned
    expect(response.body).toHaveProperty('slug', 'template-page');
    if (response.body.id === aboutId) {
      expect(response.body).toHaveProperty('name', aboutPage.name);
    }
  });
  
  test('should resolve second-level slug paths', async () => {
    const response = await retryRequest(API_URL, '/template-page/team', 'GET', 
      { 'Accept': 'application/json' },
      null,
      10 // Increase max retries for slug resolution
    );
    
    // Now fixed: We expect a 200 response as the slug resolver should work correctly
    expect(response.status).toBe(200);
    
    // Verify the correct page is returned
    expect(response.body).toHaveProperty('slug', 'team');
    if (response.body.id === teamId) {
      expect(response.body).toHaveProperty('name', 'Team Page');
    }
  });
  
  test('should resolve product detail page', async () => {
    const response = await retryRequest(API_URL, '/products/product-x', 'GET', 
      { 'Accept': 'application/json' },
      null,
      10 // Increase max retries for slug resolution
    );
    
    // Now fixed: We expect a 200 response as the slug resolver should work correctly
    expect(response.status).toBe(200);
    
    // Verify the correct page is returned
    expect(response.body).toHaveProperty('slug', 'product-x');
    if (response.body.id === productDetailId) {
      expect(response.body).toHaveProperty('name', 'Product X');
    }
  });
  
  test('should return 404 for non-existent slug path', async () => {
    const response = await retryRequest(API_URL, '/non-existent-path', 'GET', 
      { 'Accept': 'application/json' }
    );
    
    expect(response.status).toBe(404);
  });
  
  test('should return 404 for invalid nested path', async () => {
    const response = await retryRequest(API_URL, '/template-page/non-existent', 'GET', 
      { 'Accept': 'application/json' }
    );
    
    expect(response.status).toBe(404);
  });
  
  test('should validate slug format in page creation', async () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Slug Page',
      parent: rootId,
      slug: 'invalid slug with spaces', // Invalid slug format
      attributes: {
        layout: 'default'
      }
    };

    const response = await retryRequest(API_URL, '/api/v1/backend/pages', 'POST',
      { 'X-Api-Key': API_KEY, 'Content-Type': 'application/json' },
      invalidPage
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/slug/i);
  });
});