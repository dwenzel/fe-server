import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || 'test-api-key';

describe('Schema Validation Tests', () => {
  
  test('POST /pages - Should validate required fields', async () => {
    const invalidPage = {
      // Missing required id field
      name: 'Invalid Page'
    };

    const response = await request(API_URL)
      .post('/pages')
      .set('X-Api-Key', API_KEY)
      .send(invalidPage);

    expect(response.status).toBe(400);
  });

  test('POST /pages - Should validate field formats', async () => {
    const invalidPage = {
      id: 'not-a-uuid', // Invalid UUID format
      name: 'Invalid Page'
    };

    const response = await request(API_URL)
      .post('/pages')
      .set('X-Api-Key', API_KEY)
      .send(invalidPage);

    expect(response.status).toBe(400);
  });

  test('POST /pages - Should validate nested objects', async () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Page',
      metadata: {
        keywords: 'not-an-array' // Should be an array
      }
    };

    const response = await request(API_URL)
      .post('/pages')
      .set('X-Api-Key', API_KEY)
      .send(invalidPage);

    expect(response.status).toBe(400);
  });

  test('POST /items - Should validate required fields', async () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item'
      // Missing required parent and type fields
    };

    const response = await request(API_URL)
      .post('/items')
      .set('X-Api-Key', API_KEY)
      .send(invalidItem);

    expect(response.status).toBe(400);
  });

  test('POST /items - Should validate enum values', async () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'invalid-type' // Not in the allowed enum values
    };

    const response = await request(API_URL)
      .post('/items')
      .set('X-Api-Key', API_KEY)
      .send(invalidItem);

    expect(response.status).toBe(400);
  });

  test('POST /items - Should validate attribute values', async () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'dynamic',
      attributes: {
        status: 'Option3' // Not in the allowed enum values (Option1, Option2)
      }
    };

    const response = await request(API_URL)
      .post('/items')
      .set('X-Api-Key', API_KEY)
      .send(invalidItem);

    expect(response.status).toBe(400);
  });
});