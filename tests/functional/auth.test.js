import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, expect } from '@jest/globals';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const VALID_API_KEY = process.env.API_KEY || 'test-api-key';
const INVALID_API_KEY = 'invalid-api-key';

describe('Authentication Tests', () => {
  const testPage = {
    id: uuidv4(),
    name: 'Auth Test Page'
  };

  const testItem = {
    id: uuidv4(),
    name: 'Auth Test Item',
    parent: uuidv4(),
    type: 'dynamic'
  };

  test('POST /backend/pages - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .post('/api/v1/backend/pages')
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('POST /backend/pages - Should reject requests with invalid API key', async () => {
    const response = await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', INVALID_API_KEY)
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('POST /backend/pages - Should accept requests with valid API key', async () => {
    const response = await request(API_URL)
      .post('/api/v1/backend/pages')
      .set('X-Api-Key', VALID_API_KEY)
      .send(testPage);

    expect(response.status).toBe(201);
  });

  test('PUT /backend/pages/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .put(`/api/v1/backend/pages/${testPage.id}`)
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('DELETE /backend/pages/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .delete(`/api/v1/backend/pages/${testPage.id}`);

    expect(response.status).toBe(401);
  });

  test('POST /backend/items - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .post('/api/v1/backend/items')
      .send(testItem);

    expect(response.status).toBe(401);
  });

  test('PUT /backend/items/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .put(`/api/v1/backend/items/${testItem.id}`)
      .send(testItem);

    expect(response.status).toBe(401);
  });

  test('DELETE /backend/items/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .delete(`/api/v1/backend/items/${testItem.id}`);

    expect(response.status).toBe(401);
  });
});
