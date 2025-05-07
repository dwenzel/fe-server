/**
 * Test for page slug functionality
 */
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { expect } from '@jest/globals';
import config from '../../src/config.js';

// Constants
const API_URL = `http://localhost:${config.server.port}`;
const API_KEY = config.api.key;

describe('Page Slug API', () => {
  // Test data
  const testPage = {
    id: uuidv4(),
    name: 'Slug Test Page',
    slug: 'test-slug',
    attributes: {
      layout: 'default',
      priority: 1
    },
    metadata: {
      title: 'Test Slug Page',
      description: 'Test page for slug functionality',
      keywords: ['test', 'slug']
    }
  };

  // Create the test page before tests
  beforeAll(async () => {
    // Create the test page
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(testPage);
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete the test page
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${testPage.id}`)
      .set('X-Api-Key', API_KEY);
  });

  test('should retrieve a page by slug', async () => {
    const response = await request(API_URL)
      .get(`/api/${config.api.version}/frontend/pages/by-slug/${testPage.slug}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      id: testPage.id,
      name: testPage.name,
      slug: testPage.slug
    }));
  });

  test('should return 404 for non-existent slug', async () => {
    await request(API_URL)
      .get(`/api/${config.api.version}/frontend/pages/by-slug/non-existent-slug`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('should validate slug format in page creation', async () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Slug Page',
      slug: 'invalid slug with spaces', // Invalid slug format
      attributes: {
        layout: 'default'
      }
    };

    const response = await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(invalidPage)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/slug/i);
  });

  test('should accept valid slug formats', async () => {
    const validFormats = [
      'simple',
      'with-hyphens',
      'with_underscores',
      'alphanumeric123',
      '123numeric'
    ];

    for (const slug of validFormats) {
      const validPage = {
        id: uuidv4(),
        name: `Valid Slug Page: ${slug}`,
        slug,
        attributes: {
          layout: 'default'
        }
      };

      const response = await request(API_URL)
        .post(`/api/${config.api.version}/backend/pages`)
        .set('X-Api-Key', API_KEY)
        .send(validPage)
        .expect(201);

      // Clean up
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${validPage.id}`)
        .set('X-Api-Key', API_KEY);
    }
  });
});