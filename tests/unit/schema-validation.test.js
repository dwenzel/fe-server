/**
 * Unit tests for schema validation
 */
import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import PagesMiddleware from '../../src/middleware/pages.js';
import ItemsMiddleware from '../../src/middleware/items.js';
import { PagesRepository, ItemsRepository } from '../../src/services/database/repository.js';
import { InMemoryAdapter } from '../../src/services/database/memory-adapter.js';

// Mock Express request and response
const mockRequest = (body = {}, params = {}, method = 'POST') => ({
  body,
  params,
  method
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

describe('Schema Validation Functions', () => {
  let pagesMiddleware;
  let itemsMiddleware;
  let pagesRepository, itemsRepository;
  let adapter;

  beforeEach(async () => {
    mockNext.mockClear();

    // Setup InMemoryAdapter and repositories
    adapter = new InMemoryAdapter();
    await adapter.connect();
    pagesRepository = new PagesRepository(adapter);
    itemsRepository = new ItemsRepository(adapter);

    // Create middlewares with repositories
    pagesMiddleware = new PagesMiddleware(mockLogger, pagesRepository);
    itemsMiddleware = new ItemsMiddleware(mockLogger, pagesMiddleware, itemsRepository);
  });

  afterEach(async () => {
    await adapter.disconnect();
  });

  describe('validatePage', () => {
    test('should pass validation with valid root page data', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Valid Root Page Title',
        isRoot: true,
        slug: ''
      });
      const res = mockResponse();

      pagesMiddleware.validatePage(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass validation with valid child page data', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Valid Child Page Title',
        isRoot: false,
        parent: '123e4567-e89b-12d3-a456-426614174001',
        slug: 'child-page'
      });
      const res = mockResponse();

      pagesMiddleware.validatePage(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail validation with invalid UUID', () => {
      const req = mockRequest({
        id: 'invalid-uuid',
        title: 'Valid Page Title',
        isRoot: true,
        slug: ''
      });
      const res = mockResponse();

      pagesMiddleware.validatePage(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Invalid UUID')
      }));
    });

    test('should fail validation when root page has a parent', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Invalid Root Page',
        isRoot: true,
        parent: '123e4567-e89b-12d3-a456-426614174001',
        slug: ''
      });
      const res = mockResponse();

      pagesMiddleware.validatePage(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('root page cannot have a parent')
      }));
    });

    test('should fail validation when non-root page has no parent', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Invalid Child Page',
        isRoot: false,
        slug: 'child-page'
      });
      const res = mockResponse();

      pagesMiddleware.validatePage(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Non-root pages must have a parent')
      }));
    });
  });

  describe('validateItem', () => {
    test('should pass validation with valid item data', async () => {
      // Create a parent page in the repository
      const parentId = '123e4567-e89b-12d3-a456-426614174001';
      await pagesRepository.create({
        id: parentId,
        title: 'Parent Page',
        isRoot: true,
        slug: ''
      });

      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Valid Item Name',
        description: 'This is a valid item description',
        type: 'dynamic', // Using a valid type from the middleware
        parent: parentId
      });
      const res = mockResponse();

      itemsMiddleware.validateItem(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail validation with missing required fields', () => {
      const req = mockRequest({
        // Missing required fields
        id: '123e4567-e89b-12d3-a456-426614174000'
      });
      const res = mockResponse();
      
      itemsMiddleware.validateItem(req, res, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('required')
      }));
    });

    test('should fail validation with invalid item type', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Valid Item Name',
        description: 'This is a valid item description',
        type: 'invalidType', // Invalid type
        parent: '123e4567-e89b-12d3-a456-426614174001'
      });
      const res = mockResponse();

      itemsMiddleware.validateItem(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('type')
      }));
    });

    test('should fail validation with invalid parent ID', () => {
      const req = mockRequest({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Valid Item Name',
        description: 'This is a valid item description',
        type: 'dynamic',
        parent: 'invalid-uuid' // Invalid UUID
      });
      const res = mockResponse();

      itemsMiddleware.validateItem(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Invalid UUID')
      }));
    });
  });
});