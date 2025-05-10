import {afterAll, describe, expect, test} from "@jest/globals";
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('Integration Tests', () => {
  // Test data
  const pageId = uuidv4();
  const page = {
    id: pageId,
    name: 'Integration Test Page',
    metadata: {
      title: 'Integration Test Page',
      description: 'A page for integration testing',
      keywords: ['integration', 'test']
    },
    items: []
  };

  const items = [
    {
      id: uuidv4(),
      name: 'First Item',
      parent: pageId,
      type: 'dynamic',
      content: '<p>First item content</p>'
    },
    {
      id: uuidv4(),
      name: 'Second Item',
      parent: pageId,
      type: 'list',
      content: '<p>Second item content</p>'
    },
    {
      id: uuidv4(),
      name: 'Nested Item',
      parent: '', // Will be set to the first item's ID
      type: 'news',
      content: '<p>Nested item content</p>'
    }
  ];

  // Clean up after tests
  afterAll(async () => {
    // Try to delete items first
    for (const item of items) {
      await request(API_URL)
        .delete(`/api/v1/backend/items/${item.id}`)
        .set('X-Api-Key', API_KEY);
    }

    // Then delete the page
    await request(API_URL)
      .delete(`/api/v1/backend/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);
  });

  test('Create page and multiple items with parent-child relationships', async () => {
    // 1. Create the page
    const pageResponse = await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', API_KEY)
      .send(page);

    expect(pageResponse.status).toBe(201);

    // 2. Create the first two items
    for (let i = 0; i < 2; i++) {
      const response = await request(API_URL)
        .post('/api/v1/backend/items')
        .set('X-Api-Key', API_KEY)
        .send(items[i]);

      expect(response.status).toBe(201);
    }

    // 3. Create a nested item (item that has another item as parent)
    items[2].parent = items[0].id; // Set the first item as parent

    const nestedItemResponse = await request(API_URL)
      .post('/api/v1/backend/items')
      .set('X-Api-Key', API_KEY)
      .send(items[2]);

    expect(nestedItemResponse.status).toBe(201);

    // 4. Update the page with multiple items
    const updatedPage = {
      ...page,
      name: 'Updated Integration Test Page',
      items: [items[0], items[1]] // Add items to the page
    };

    const updatePageResponse = await request(API_URL)
      .put(`/api/v1/backend/pages/${pageId}`)
      .set('X-Api-Key', API_KEY)
      .send(updatedPage);

    expect(updatePageResponse.status).toBe(200);
  });

  test('Delete operations should fail with 404 after items are deleted', async () => {
    // 1. Delete the first item
    const deleteResponse = await request(API_URL)
      .delete(`/api/v1/backend/items/${items[0].id}`)
      .set('X-Api-Key', API_KEY);

    expect(deleteResponse.status).toBe(204);

    // 2. Second delete should fail with 404
    const secondDeleteResponse = await request(API_URL)
      .delete(`/api/v1/backend/items/${items[0].id}`)
      .set('X-Api-Key', API_KEY);

    expect(secondDeleteResponse.status).toBe(404);

    // 3. Update should also fail with 404
    const updateResponse = await request(API_URL)
      .put(`/api/v1/backend/items/${items[0].id}`)
      .set('X-Api-Key', API_KEY)
      .send(items[0]);

    expect(updateResponse.status).toBe(404);
  });

  test('API Key validation should be consistent across endpoints', async () => {
    // Check all endpoints require API key
    const endpoints = [
      { method: 'post', url: '/api/v1/backend/pages' },
      { method: 'put', url: `/api/v1/backend/pages/${pageId}` },
      { method: 'delete', url: `/api/v1/backend/pages/${pageId}` },
      { method: 'post', url: '/api/v1/backend/items' },
      { method: 'put', url: `/api/v1/backend/items/${items[1].id}` },
      { method: 'delete', url: `/api/v1/backend/items/${items[1].id}` }
    ];

    for (const endpoint of endpoints) {
      const requestWithoutKey = request(API_URL)[endpoint.method](endpoint.url);

      // Add a body for POST and PUT requests
      if (endpoint.method === 'post' || endpoint.method === 'put') {
        requestWithoutKey.send(endpoint.method === 'post' ? page : items[1]);
      }

      const response = await requestWithoutKey;
      expect(response.status).toBe(401);
    }
  });
});
