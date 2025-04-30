import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.API_URL || 'http://localhost:3000';
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

  test('POST /pages - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .post('/pages')
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('POST /pages - Should reject requests with invalid API key', async () => {
    const response = await request(API_URL)
      .post('/pages')
      .set('X-Api-Key', INVALID_API_KEY)
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('PUT /pages/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .put(`/pages/${testPage.id}`)
      .send(testPage);

    expect(response.status).toBe(401);
  });

  test('DELETE /pages/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .delete(`/pages/${testPage.id}`);

    expect(response.status).toBe(401);
  });

  test('POST /items - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .post('/items')
      .send(testItem);

    expect(response.status).toBe(401);
  });

  test('PUT /items/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .put(`/items/${testItem.id}`)
      .send(testItem);

    expect(response.status).toBe(401);
  });

  test('DELETE /items/{id} - Should reject requests without API key', async () => {
    const response = await request(API_URL)
      .delete(`/items/${testItem.id}`);

    expect(response.status).toBe(401);
  });
});