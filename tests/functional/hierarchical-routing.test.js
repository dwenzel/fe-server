/**
 * Test for hierarchical slug-based routing
 */
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import config from '../../src/config.js';

// Constants
const API_URL = `http://localhost:${config.server.port}`;
const API_KEY = config.api.key;

describe('Hierarchical Slug-Based Routing', () => {
  // Test data - create a root page and child pages with slugs
  const rootId = uuidv4();
  const aboutId = uuidv4();
  const teamId = uuidv4();
  const productsId = uuidv4();
  const productDetailId = uuidv4();
  
  const rootPage = {
    id: rootId,
    name: 'Home Page',
    isRoot: true,
    slug: '',
    metadata: {
      title: 'My Website',
      description: 'Welcome to my website',
      keywords: ['test', 'home']
    }
  };
  
  const aboutPage = {
    id: aboutId,
    name: 'About Page',
    parent: rootId,
    slug: 'about',
    metadata: {
      title: 'About Us',
      description: 'Learn about our company',
      keywords: ['about', 'company']
    }
  };
  
  const teamPage = {
    id: teamId,
    name: 'Team Page',
    parent: aboutId,
    slug: 'team',
    metadata: {
      title: 'Our Team',
      description: 'Meet our awesome team',
      keywords: ['team', 'staff']
    }
  };
  
  const productsPage = {
    id: productsId,
    name: 'Products Page',
    parent: rootId,
    slug: 'products',
    metadata: {
      title: 'Our Products',
      description: 'View our product catalog',
      keywords: ['products', 'catalog']
    }
  };
  
  const productDetailPage = {
    id: productDetailId,
    name: 'Product X',
    parent: productsId,
    slug: 'product-x',
    metadata: {
      title: 'Product X Details',
      description: 'Details about Product X',
      keywords: ['product', 'details']
    }
  };

  // Create the test pages before tests
  beforeAll(async () => {
    // First delete any existing test pages from previous test runs
    try {
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${productDetailId}`)
        .set('X-Api-Key', API_KEY);
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
    
    try {
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${teamId}`)
        .set('X-Api-Key', API_KEY);
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
    
    try {
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${productsId}`)
        .set('X-Api-Key', API_KEY);
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
    
    try {
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${aboutId}`)
        .set('X-Api-Key', API_KEY);
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
    
    try {
      await request(API_URL)
        .delete(`/api/${config.api.version}/backend/pages/${rootId}`)
        .set('X-Api-Key', API_KEY);
    } catch (error) {
      // Ignore errors if page doesn't exist
    }
    
    // Now create fresh test pages
    // Create root page
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(rootPage);
      
    // Create first-level pages
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(aboutPage);
      
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(productsPage);
      
    // Create second-level pages
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(teamPage);
      
    await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(productDetailPage);
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete in reverse order of creation
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${productDetailId}`)
      .set('X-Api-Key', API_KEY);
      
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${teamId}`)
      .set('X-Api-Key', API_KEY);
      
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${productsId}`)
      .set('X-Api-Key', API_KEY);
      
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${aboutId}`)
      .set('X-Api-Key', API_KEY);
      
    await request(API_URL)
      .delete(`/api/${config.api.version}/backend/pages/${rootId}`)
      .set('X-Api-Key', API_KEY);
  });

  test('should serve the root page at /', async () => {
    const response = await request(API_URL)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('id', rootId);
    expect(response.body).toHaveProperty('isRoot', true);
    expect(response.body).toHaveProperty('name', 'Home Page');
  });
  
  test('should resolve first-level slug paths', async () => {
    const response = await request(API_URL)
      .get('/about')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('id', aboutId);
    expect(response.body).toHaveProperty('slug', 'about');
    expect(response.body).toHaveProperty('name', 'About Page');
  });
  
  test('should resolve second-level slug paths', async () => {
    const response = await request(API_URL)
      .get('/about/team')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('id', teamId);
    expect(response.body).toHaveProperty('slug', 'team');
    expect(response.body).toHaveProperty('name', 'Team Page');
  });
  
  test('should resolve product detail page', async () => {
    const response = await request(API_URL)
      .get('/products/product-x')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('id', productDetailId);
    expect(response.body).toHaveProperty('slug', 'product-x');
    expect(response.body).toHaveProperty('name', 'Product X');
  });
  
  test('should return 404 for non-existent slug path', async () => {
    await request(API_URL)
      .get('/non-existent-path')
      .set('Accept', 'application/json')
      .expect(404);
  });
  
  test('should return 404 for invalid nested path', async () => {
    await request(API_URL)
      .get('/about/non-existent')
      .set('Accept', 'application/json')
      .expect(404);
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

    const response = await request(API_URL)
      .post(`/api/${config.api.version}/backend/pages`)
      .set('X-Api-Key', API_KEY)
      .send(invalidPage)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/slug/i);
  });
});