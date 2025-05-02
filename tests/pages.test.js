import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

// Replace with actual server URL when deployed
// For local development, you'll need to start the server separately before running tests
const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('Pages API', () => {
  let pageId;

  // Test data
  const newPage = {
    id: uuidv4(),
    name: 'Test Page',
    attributes: {
      layout: 'default',
      visible: 1,
      status: 'Option1'
    },
    metadata: {
      title: 'Test Page',
      description: 'A test page',
      robots: 'index,follow',
      keywords: ['test', 'page']
    },
    items: [] // Empty items array
  };

  const updatedPage = {
    ...newPage,
    name: 'Updated Test Page',
    metadata: {
      ...newPage.metadata,
      title: 'Updated Test Page'
    }
  };

  // Tests
  test('POST /pages - Create a new page', async () => {
    const response = await request(API_URL)
      .post('/pages')
      .set('X-Api-Key', API_KEY)
      .send(newPage);

    expect(response.status).toBe(201);
    pageId = newPage.id;
  });

  test('PUT /pages/{id} - Update a page', async () => {
    const response = await request(API_URL)
      .put(`/pages/${pageId}`)
      .set('X-Api-Key', API_KEY)
      .send(updatedPage);

    expect(response.status).toBe(200);
  });

  test('PUT /pages/{id} - Should return 404 for non-existent page', async () => {
    const nonExistentId = uuidv4();
    const response = await request(API_URL)
      .put(`/pages/${nonExistentId}`)
      .set('X-Api-Key', API_KEY)
      .send({
        ...updatedPage,
        id: nonExistentId
      });

    expect(response.status).toBe(404);
  });

  test('PUT /pages/{id} - Should return 401 without API key', async () => {
    const response = await request(API_URL)
      .put(`/pages/${pageId}`)
      .send(updatedPage);

    expect(response.status).toBe(401);
  });

  test('DELETE /pages/{id} - Delete a page', async () => {
    const response = await request(API_URL)
      .delete(`/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);

    expect(response.status).toBe(204);
  });

  test('DELETE /pages/{id} - Should return 404 for non-existent page', async () => {
    const response = await request(API_URL)
      .delete(`/pages/${pageId}`)
      .set('X-Api-Key', API_KEY);

    expect(response.status).toBe(404);
  });
});
