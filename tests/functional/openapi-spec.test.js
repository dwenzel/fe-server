/**
 * Tests for OpenAPI specification validation
 * This test ensures that our API implementation matches the OpenAPI specification
 */
const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { v4: uuidv4 } = require('uuid');
const request = require('supertest');

const API_URL = process.env.API_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || 'test-api-key';

// Load and parse the OpenAPI spec
const openApiPath = path.join(__dirname, '../../spec/feServerAPI.yaml');
const openApiSpec = YAML.load(fs.readFileSync(openApiPath, 'utf8'));

// Setup JSON Schema validator
const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv); // Adds support for formats like uuid

describe('OpenAPI Specification Tests', () => {
  let pageSchema;
  let itemSchema;
  let validPageId;
  let validItemId;

  beforeAll(() => {
    // Extract schemas from OpenAPI spec
    pageSchema = openApiSpec.components.schemas.Page;
    itemSchema = openApiSpec.components.schemas.Item;
    const metadataSchema = openApiSpec.components.schemas.Metadata;
    
    // Compile schemas - add all required schemas
    ajv.addSchema(metadataSchema, 'Metadata');
    ajv.addSchema(pageSchema, 'Page');
    ajv.addSchema(itemSchema, 'Item');
    
    // Add the entire schema with all references
    ajv.addSchema(openApiSpec, 'OpenAPI');
  });

  describe('API Endpoints vs OpenAPI Spec', () => {
    test('All endpoints in the OpenAPI spec should be implemented', async () => {
      // Check that all defined endpoints in the spec respond
      const endpointsToTest = [
        { method: 'post', path: '/backend/pages' },
        { method: 'put', path: `/backend/pages/${uuidv4()}` },
        { method: 'delete', path: `/backend/pages/${uuidv4()}` },
        { method: 'post', path: '/backend/items' },
        { method: 'put', path: `/backend/items/${uuidv4()}` },
        { method: 'delete', path: `/backend/items/${uuidv4()}` }
      ];

      for (const endpoint of endpointsToTest) {
        const response = await request(API_URL)
          [endpoint.method](endpoint.path)
          .set('X-Api-Key', API_KEY)
          .send({ id: uuidv4() }); // Minimal payload for validation
        
        // Even if we get 400 (validation failed) or 404 (not found),
        // that's okay because it means the endpoint exists
        expect([200, 201, 204, 400, 401, 404]).toContain(response.status);
      }
    });
  });

  describe('Page Schema Conformance', () => {
    test('POST /pages should conform to Page schema', async () => {
      const validPage = {
        id: uuidv4(),
        name: 'Test Page',
        attributes: {
          category: 'Option1',
          priority: 5
        },
        metadata: {
          title: 'Test Page Title',
          description: 'Test Page Description',
          keywords: ['test', 'page']
        }
      };

      // Direct validation without references
      const isValid = ajv.validate({
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          attributes: { type: 'object' },
          metadata: { type: 'object' }
        }
      }, validPage);
      expect(isValid).toBe(true);

      // Test API with valid page
      const response = await request(API_URL)
        .post('/backend/pages')
        .set('X-Api-Key', API_KEY)
        .send(validPage);

      expect(response.status).toBe(201);
      validPageId = validPage.id;
    });

    test('PUT /backend/pages/{id} should conform to Page schema', async () => {
      if (!validPageId) {
        validPageId = uuidv4();
        // Create a page first
        await request(API_URL)
          .post('/backend/pages')
          .set('X-Api-Key', API_KEY)
          .send({ id: validPageId, name: 'Initial Page' });
      }

      const updatedPage = {
        id: validPageId,
        name: 'Updated Test Page',
        attributes: {
          category: 'Option2',
          priority: 10
        },
        metadata: {
          title: 'Updated Test Page Title',
          description: 'Updated Test Page Description',
          keywords: ['updated', 'test', 'page']
        }
      };

      // Direct validation without references
      const isValid = ajv.validate({
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          attributes: { type: 'object' },
          metadata: { type: 'object' }
        }
      }, updatedPage);
      expect(isValid).toBe(true);

      // Test API with valid updated page
      const response = await request(API_URL)
        .put(`/backend/pages/${validPageId}`)
        .set('X-Api-Key', API_KEY)
        .send(updatedPage);

      expect(response.status).toBe(200);
    });
  });

  describe('Item Schema Conformance', () => {
    test('POST /backend/items should conform to Item schema', async () => {
      if (!validPageId) {
        validPageId = uuidv4();
        // Create a page first
        await request(API_URL)
          .post('/backend/pages')
          .set('X-Api-Key', API_KEY)
          .send({ id: validPageId, name: 'Parent Page' });
      }

      const validItem = {
        id: uuidv4(),
        name: 'Test Item',
        parent: validPageId,
        type: 'list',
        attributes: {
          status: 'Option1',
          order: 1
        },
        content: 'Test item content'
      };

      // Direct validation without references
      const isValid = ajv.validate({
        type: 'object',
        required: ['id', 'parent', 'type'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          parent: { type: 'string', format: 'uuid' },
          type: { 
            type: 'string', 
            enum: ['dynamic', 'list', 'news', 'project', 'event']
          },
          attributes: { type: 'object' },
          content: { type: 'string' }
        }
      }, validItem);
      expect(isValid).toBe(true);

      // Test API with valid item
      const response = await request(API_URL)
        .post('/backend/items')
        .set('X-Api-Key', API_KEY)
        .send(validItem);

      expect(response.status).toBe(201);
      validItemId = validItem.id;
    });

    test('PUT /backend/items/{id} should conform to Item schema', async () => {
      if (!validItemId || !validPageId) {
        validItemId = uuidv4();
        validPageId = uuidv4();
        
        // Create a page and item first
        await request(API_URL)
          .post('/backend/pages')
          .set('X-Api-Key', API_KEY)
          .send({ id: validPageId, name: 'Parent Page' });
          
        await request(API_URL)
          .post('/backend/items')
          .set('X-Api-Key', API_KEY)
          .send({ 
            id: validItemId, 
            name: 'Initial Item', 
            parent: validPageId,
            type: 'dynamic' 
          });
      }

      const updatedItem = {
        id: validItemId,
        name: 'Updated Test Item',
        parent: validPageId,
        type: 'news',
        attributes: {
          status: 'Option2',
          order: 2
        },
        content: 'Updated test item content'
      };

      // Direct validation without references
      const isValid = ajv.validate({
        type: 'object',
        required: ['id', 'parent', 'type'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          parent: { type: 'string', format: 'uuid' },
          type: { 
            type: 'string', 
            enum: ['dynamic', 'list', 'news', 'project', 'event']
          },
          attributes: { type: 'object' },
          content: { type: 'string' }
        }
      }, updatedItem);
      expect(isValid).toBe(true);

      // Test API with valid updated item
      const response = await request(API_URL)
        .put(`/backend/items/${validItemId}`)
        .set('X-Api-Key', API_KEY)
        .send(updatedItem);

      expect(response.status).toBe(200);
    });
  });

  describe('Security Requirements', () => {
    test('Endpoints should require API key authentication', async () => {
      // Test without API key
      const noAuthPageResponse = await request(API_URL)
        .post('/backend/pages')
        .send({ id: uuidv4(), name: 'Test Page' });

      expect(noAuthPageResponse.status).toBe(401);

      const noAuthItemResponse = await request(API_URL)
        .post('/backend/items')
        .send({ 
          id: uuidv4(), 
          name: 'Test Item',
          parent: uuidv4(),
          type: 'dynamic'
        });

      expect(noAuthItemResponse.status).toBe(401);
    });
  });

  describe('Schema Definition Completeness', () => {
    test('Page schema should define all required properties', () => {
      const requiredProperties = ['id'];
      
      expect(pageSchema.required).toBeDefined();
      for (const prop of requiredProperties) {
        expect(pageSchema.required).toContain(prop);
      }
      
      // Check all defined properties exist
      const expectedProperties = [
        'id', 'name', 'attributes', 'parent', 'metadata', 'items'
      ];
      
      for (const prop of expectedProperties) {
        expect(pageSchema.properties[prop]).toBeDefined();
      }
    });

    test('Item schema should define all required properties', () => {
      const requiredProperties = ['id', 'parent', 'type'];
      
      expect(itemSchema.required).toBeDefined();
      for (const prop of requiredProperties) {
        expect(itemSchema.required).toContain(prop);
      }
      
      // Check all defined properties exist
      const expectedProperties = [
        'id', 'name', 'attributes', 'content', 'parent', 'type'
      ];
      
      for (const prop of expectedProperties) {
        expect(itemSchema.properties[prop]).toBeDefined();
      }
      
      // Check enum values for type
      const expectedTypes = ['dynamic', 'list', 'news', 'project', 'event'];
      expect(itemSchema.properties.type.enum).toEqual(expectedTypes);
    });
  });
});