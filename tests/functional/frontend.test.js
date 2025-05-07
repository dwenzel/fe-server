import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('Frontend Public API', () => {
  // Test data
  const pageId = uuidv4();
  const itemId = uuidv4();
  
  const testPage = {
    id: pageId,
    name: 'Test Frontend Page',
    metadata: {
      title: 'Public Test Page',
      description: 'A test page for frontend public API',
      keywords: ['test', 'frontend', 'public']
    }
  };
  
  const testItem = {
    id: itemId,
    name: 'Test Frontend Item',
    parent: pageId,
    type: 'dynamic',
    content: '<p>This is test content for public API</p>'
  };

  // Setup: Create test page and item using authenticated API
  beforeAll(async () => {
    // Create test page
    await request(API_URL)
      .post('/backend/pages')
      .set('X-Api-Key', API_KEY)
      .send(testPage);
      
    // Create test item
    await request(API_URL)
      .post('/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(testItem);
  });

  // Cleanup: Delete test data after tests
  afterAll(async () => {
    // Delete test item
    await request(API_URL)
      .delete(`/backend/items/${itemId}`)
      .set('X-Api-Key', API_KEY);
      
    // Delete test page
    await request(API_URL)
      .delete(`/backend/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);
  });

  // Tests for pages endpoints
  describe('Pages Public Endpoints', () => {
    test('GET /frontend/pages - Should return all pages without authentication', async () => {
      const response = await request(API_URL)
        .get('/frontend/pages');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Find our test page in the response
      const foundPage = response.body.find(page => page.id === pageId);
      expect(foundPage).toBeDefined();
      expect(foundPage.name).toBe('Test Frontend Page');
    });

    test('GET /frontend/pages/{id} - Should return a specific page', async () => {
      const response = await request(API_URL)
        .get(`/frontend/pages/${pageId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(pageId);
      expect(response.body.name).toBe('Test Frontend Page');
      expect(response.body.metadata.title).toBe('Public Test Page');
    });

    test('GET /frontend/pages/{id} - Should return 404 for non-existent page', async () => {
      const nonExistentId = uuidv4();
      const response = await request(API_URL)
        .get(`/frontend/pages/${nonExistentId}`);
      
      expect(response.status).toBe(404);
    });
  });

  // Tests for items endpoints
  describe('Items Public Endpoints', () => {
    test('GET /frontend/items - Should return all items without authentication', async () => {
      const response = await request(API_URL)
        .get('/frontend/items');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Find our test item in the response
      const foundItem = response.body.find(item => item.id === itemId);
      expect(foundItem).toBeDefined();
      expect(foundItem.name).toBe('Test Frontend Item');
      expect(foundItem.parent).toBe(pageId);
    });

    test('GET /frontend/items/{id} - Should return a specific item', async () => {
      const response = await request(API_URL)
        .get(`/frontend/items/${itemId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(itemId);
      expect(response.body.name).toBe('Test Frontend Item');
      expect(response.body.type).toBe('dynamic');
    });

    test('GET /frontend/items/{id} - Should return 404 for non-existent item', async () => {
      const nonExistentId = uuidv4();
      const response = await request(API_URL)
        .get(`/frontend/items/${nonExistentId}`);
      
      expect(response.status).toBe(404);
    });
  });
});