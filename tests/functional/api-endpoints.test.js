import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('API Public Endpoints', () => {
  // Test data
  const pageId = uuidv4();
  const itemId = uuidv4();

  const testPage = {
    id: pageId,
    name: 'Test API Page',
    slug: 'test-page', // Required for non-root pages
    parent: '', // Will be set if needed
    isRoot: false, // Will be updated in test setup
    metadata: {
      title: 'Public Test Page',
      description: 'A test page for public API',
      keywords: ['test', 'api', 'public']
    }
  };

  const testItem = {
    id: itemId,
    name: 'Test API Item',
    parent: pageId,
    type: 'dynamic',
    content: '<p>This is test content for public API</p>'
  };

  // Setup: Create test page and item using authenticated API
  beforeAll(async () => {
    // Create root page if needed for parent
    const rootId = uuidv4();
    const rootPage = {
      id: rootId,
      name: 'Root Page',
      isRoot: true,
      slug: '',
      metadata: {
        title: 'Root Page',
        description: 'Root page for tests'
      }
    };

    // Create root page for tests
    await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', API_KEY)
      .send(rootPage);

    // Update test page to have the root page as parent
    testPage.parent = rootId;

    // Create test page
    await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', API_KEY)
      .send(testPage);

    // Create test item
    await request(API_URL)
      .post('/api/v1/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(testItem);
  });

  // Cleanup: Delete test data after tests
  afterAll(async () => {
    // Delete test item
    await request(API_URL)
      .delete(`/api/v1/backend/items/${itemId}`)
      .set('X-Api-Key', API_KEY);

    // Delete test page
    await request(API_URL)
      .delete(`/api/v1/backend/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);

    // Find and delete root page
    const rootPagesResponse = await request(API_URL)
      .get('/api/v1/pages')
      .set('Accept', 'application/json');

    const rootPage = rootPagesResponse.body.find(page => page.isRoot === true);
    if (rootPage) {
      await request(API_URL)
        .delete(`/api/v1/backend/pages/${rootPage.id}`)
        .set('X-Api-Key', API_KEY);
    }
  });

  // Tests for pages endpoints
  describe('Pages API Endpoints', () => {
    test('GET /api/v1/pages - Should return all pages without authentication', async () => {
      //const response = request(API_URL).get().accepts('application/json')

        const response = await request(API_URL)
        .get('/api/v1/pages')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // Find our test page in the response
      const foundPage = response.body.find(page => page.id === pageId);
      expect(foundPage).toBeDefined();
      expect(foundPage.name).toBe('Test API Page');
    });

    test('GET /api/v1/pages/{id} - Should return a specific page', async () => {
      const response = await request(API_URL)
        .get(`/api/v1/pages/${pageId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(pageId);
      expect(response.body.name).toBe('Test API Page');
      expect(response.body.metadata.title).toBe('Public Test Page');
    });

    test('GET /api/v1/pages/{id} - Should return 404 for non-existent page', async () => {
      const nonExistentId = uuidv4();
      const response = await request(API_URL)
        .get(`/api/v1/pages/${nonExistentId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });
  });

  // Tests for items endpoints
  describe('Items API Endpoints', () => {
    test('GET /api/v1/items - Should return all items without authentication', async () => {
      const response = await request(API_URL)
        .get('/api/v1/items')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // Find our test item in the response
      const foundItem = response.body.find(item => item.id === itemId);
      expect(foundItem).toBeDefined();
      expect(foundItem.name).toBe('Test API Item');
      expect(foundItem.parent).toBe(pageId);
    });

    test('GET /api/v1/items/{id} - Should return a specific item', async () => {
      const response = await request(API_URL)
        .get(`/api/v1/items/${itemId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(itemId);
      expect(response.body.name).toBe('Test API Item');
      expect(response.body.type).toBe('dynamic');
    });

    test('GET /api/v1/items/{id} - Should return 404 for non-existent item', async () => {
      const nonExistentId = uuidv4();
      const response = await request(API_URL)
        .get(`/api/v1/items/${nonExistentId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });
  });

  // Test for content negotiation
  describe('Content Negotiation', () => {
    test('Pages endpoint should support JSON format via Accept header', async () => {
      const response = await request(API_URL)
        .get(`/api/v1/pages/${pageId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
    });

    test('Pages endpoint should support HTML format via Accept header', async () => {
      const response = await request(API_URL)
        .get(`/api/v1/pages/${pageId}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
    });

    test('Pages endpoint should support format query parameter', async () => {
      const response = await request(API_URL)
        .get(`/api/v1/pages/${pageId}?format=json`);

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
    });
  });
});
