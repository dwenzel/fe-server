import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

// Replace with actual server URL when deployed
const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('Items API (old)', () => {
  let pageId, itemId;

  // Create a parent page first
  beforeAll(async () => {
    pageId = uuidv4();
    const page = {
      id: pageId,
      name: 'Parent Page for Items',
      metadata: {
        title: 'Parent Page',
        description: 'A parent page for items tests'
      },
      items: [] // Empty items array
    };

    await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', API_KEY)
      .send(page);
  });

  // Clean up after tests
  afterAll(async () => {
    await request(API_URL)
      .delete(`/api/v1/backend/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);
  });

  // Test data
  const newItem = {
    id: uuidv4(),
    name: 'Test Item',
    parent: '', // Will be set to pageId in the test
    type: 'dynamic',
    attributes: {
      position: 1,
      visibility: 'Option1'
    },
    content: '<p>This is a test item content</p>'
  };

  const updatedItem = {
    ...newItem,
    name: 'Updated Test Item',
    content: '<p>This is updated test item content</p>'
  };

  // Tests
  test('POST /backend/items - Create a new item', async () => {
    newItem.parent = pageId;
    itemId = newItem.id;

    const response = await request(API_URL)
      .post('/api/v1/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(newItem);

    expect(response.status).toBe(201);
  });

  test('POST /backend/items - Should return 400 for invalid input', async () => {
    const invalidItem = {
      name: 'Invalid Item',
      // Missing required fields: id, parent, type
    };

    const response = await request(API_URL)
      .post('/api/v1/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(invalidItem);

    expect(response.status).toBe(400);
  });

  test('POST /backend/items - Should validate enum type values', async () => {
    const invalidTypeItem = {
      id: uuidv4(),
      name: 'Invalid Type Item',
      parent: pageId,
      type: 'invalid-type' // Not in the allowed enum values
    };

    const response = await request(API_URL)
      .post('/api/v1/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(invalidTypeItem);

    expect(response.status).toBe(400);
  });

  test('PUT /backend/items/{id} - Update an item', async () => {
    updatedItem.parent = pageId;
    updatedItem.id = itemId;

    const response = await request(API_URL)
      .put(`/api/v1/backend/items/${itemId}`)
      .set('X-Api-Key', API_KEY)
      .send(updatedItem);

    expect(response.status).toBe(200);
  });

  test('PUT /backend/items/{id} - Should return 404 for non-existent item', async () => {
    const nonExistentId = uuidv4();
    const response = await request(API_URL)
      .put(`/api/v1/backend/items/${nonExistentId}`)
      .set('X-Api-Key', API_KEY)
      .send({
        ...updatedItem,
        id: nonExistentId
      });

    expect(response.status).toBe(404);
  });

  test('PUT /backend/items/{id} - Should return 401 without API key', async () => {
    const response = await request(API_URL)
      .put(`/api/v1/backend/items/${itemId}`)
      .send(updatedItem);

    expect(response.status).toBe(401);
  });

  test('DELETE /backend/items/{id} - Delete an item', async () => {
    const response = await request(API_URL)
      .delete(`/api/v1/backend/items/${itemId}`)
      .set('X-Api-Key', API_KEY);

    expect(response.status).toBe(204);
  });

  test('DELETE /backend/items/{id} - Should return 404 for non-existent item', async () => {
    const response = await request(API_URL)
      .delete(`/api/v1/backend/items/${itemId}`)
      .set('X-Api-Key', API_KEY);

    expect(response.status).toBe(404);
  });
});
