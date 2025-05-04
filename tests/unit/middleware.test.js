/**
 * Unit tests for middleware classes
 */
import PagesMiddleware from '../../src/middleware/pages.js';
import ItemsMiddleware from '../../src/middleware/items.js';
import { validateApiKey } from '../../src/middleware/auth.js';
import { validateIdMatch } from '../../src/middleware/validation.js';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, beforeEach, jest, expect } from "@jest/globals";

// Mock logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock request and response
const mockRequest = (body = {}, params = {}, headers = {}) => ({
  body,
  params,
  header: jest.fn(name => headers[name]),
  method: 'GET'
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Pages Middleware', () => {
  let pagesMiddleware;

  beforeEach(() => {
    pagesMiddleware = new PagesMiddleware(mockLogger);
    mockNext.mockClear();
  });

  test('validatePage should pass valid page', () => {
    const validPage = {
      id: uuidv4(),
      name: 'Test Page',
      metadata: {
        keywords: ['test']
      },
      items: []
    };

    const req = mockRequest(validPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validatePage should reject page without ID', () => {
    const invalidPage = {
      name: 'Invalid Page'
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('createPage should store page and return 201', () => {
    const page = {
      id: uuidv4(),
      name: 'Test Page'
    };

    const req = mockRequest(page);
    const res = mockResponse();

    pagesMiddleware.createPage(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(pagesMiddleware.hasPage(page.id)).toBe(true);
  });
  
  test('updatePage should update existing page and return 200', () => {
    // Create a page first
    const pageId = uuidv4();
    const originalPage = { id: pageId, name: 'Original Page' };
    pagesMiddleware.getDataStore().set(pageId, originalPage);
    
    // Update it
    const updatedPage = { id: pageId, name: 'Updated Page' };
    const req = mockRequest(updatedPage, { id: pageId });
    const res = mockResponse();
    
    pagesMiddleware.updatePage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Verify page was updated
    const storedPage = pagesMiddleware.getDataStore().get(pageId);
    expect(storedPage).toEqual(updatedPage);
  });
  
  test('deletePage should remove page and return 204', () => {
    // Create a page first
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Test Page' };
    pagesMiddleware.getDataStore().set(pageId, page);
    
    const req = mockRequest({}, { id: pageId });
    const res = mockResponse();
    
    pagesMiddleware.deletePage(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(pagesMiddleware.hasPage(pageId)).toBe(false);
  });
});

describe('Items Middleware', () => {
  let pagesMiddleware, itemsMiddleware;

  beforeEach(() => {
    pagesMiddleware = new PagesMiddleware(mockLogger);
    itemsMiddleware = new ItemsMiddleware(mockLogger, pagesMiddleware);
    mockNext.mockClear();
  });

  test('validateItem should pass valid item', () => {
    // Create a parent page first
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Parent Page' };
    pagesMiddleware.getDataStore().set(pageId, page);

    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: pageId,
      type: 'dynamic'
    };

    const req = mockRequest(validItem);
    req.method = 'POST'; // Set method to POST for parent validation
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validateItem should reject item with invalid type', () => {
    const pageId = uuidv4();
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: pageId,
      type: 'invalid-type'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('createItem should store item and return 201', () => {
    const itemId = uuidv4();
    const pageId = uuidv4();
    const item = {
      id: itemId,
      name: 'Test Item',
      parent: pageId,
      type: 'dynamic'
    };

    const req = mockRequest(item);
    const res = mockResponse();

    itemsMiddleware.createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    
    // Verify item was stored
    const storedItem = itemsMiddleware.getDataStore().get(itemId);
    expect(storedItem).toEqual(item);
  });
  
  test('updateItem should update existing item and return 200', () => {
    // Create an item first
    const itemId = uuidv4();
    const originalItem = { 
      id: itemId, 
      name: 'Original Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    itemsMiddleware.getDataStore().set(itemId, originalItem);
    
    // Update it
    const updatedItem = { 
      id: itemId, 
      name: 'Updated Item',
      parent: originalItem.parent,
      type: 'dynamic'
    };
    const req = mockRequest(updatedItem, { id: itemId });
    const res = mockResponse();
    
    itemsMiddleware.updateItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Verify item was updated
    const storedItem = itemsMiddleware.getDataStore().get(itemId);
    expect(storedItem).toEqual(updatedItem);
  });
});

describe('Auth Middleware', () => {
  test('validateApiKey should pass with valid key', () => {
    const req = mockRequest({}, {}, { 'X-Api-Key': 'test-api-key' });
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validateApiKey should reject with invalid key', () => {
    const req = mockRequest({}, {}, { 'X-Api-Key': 'wrong-key' });
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateApiKey should reject with missing key', () => {
    const req = mockRequest();
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('Validation Middleware', () => {
  test('validateIdMatch should pass when IDs match', () => {
    const id = uuidv4();
    const req = mockRequest({ id }, { id });
    const res = mockResponse();

    validateIdMatch(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validateIdMatch should reject when IDs do not match', () => {
    const req = mockRequest({ id: uuidv4() }, { id: uuidv4() });
    const res = mockResponse();

    validateIdMatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});