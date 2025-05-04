/**
 * Unit tests for ItemsMiddleware
 */
import PagesMiddleware from '../../../src/middleware/pages.js';
import ItemsMiddleware from '../../../src/middleware/items.js';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, beforeEach, jest, expect } from "@jest/globals";

// Mock logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock request and response
const mockRequest = (body = {}, params = {}, headers = {}, method = 'GET') => ({
  body,
  params,
  header: jest.fn(name => headers[name]),
  method
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

describe('Items Middleware', () => {
  let pagesMiddleware, itemsMiddleware;

  beforeEach(() => {
    pagesMiddleware = new PagesMiddleware(mockLogger);
    itemsMiddleware = new ItemsMiddleware(mockLogger, pagesMiddleware);
    mockNext.mockClear();
    mockLogger.info.mockClear();
    mockLogger.warn.mockClear();
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

  test('validateItem should reject item without ID', () => {
    const invalidItem = {
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'dynamic'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item ID is required' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateItem should reject item without parent', () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      type: 'dynamic'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parent ID is required' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateItem should reject item without type', () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: uuidv4()
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item type is required' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateItem should reject item with invalid ID format', () => {
    const invalidItem = {
      id: 'not-a-uuid',
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'dynamic'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid UUID format for item ID' });
    expect(mockNext).not.toHaveBeenCalled();
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
  
  test('validateItem should reject item with invalid status', () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'dynamic',
      attributes: {
        status: 'invalid-status'
      }
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Invalid status') }));
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateItem should pass with empty attributes', () => {
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Parent Page' };
    pagesMiddleware.getDataStore().set(pageId, page);
    
    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: pageId,
      type: 'dynamic',
      attributes: {}
    };
    
    const req = mockRequest(validItem);
    req.method = 'POST';
    const res = mockResponse();
    
    itemsMiddleware.validateItem(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  
  test('validateItem should pass with valid status', () => {
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Parent Page' };
    pagesMiddleware.getDataStore().set(pageId, page);
    
    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: pageId,
      type: 'dynamic',
      attributes: { 
        status: 'Option1'  // Using a valid status from config
      }
    };
    
    const req = mockRequest(validItem);
    req.method = 'POST';
    const res = mockResponse();
    
    itemsMiddleware.validateItem(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  
  test('validateItem should reject creation with non-existent parent', () => {
    const nonExistentParentId = uuidv4();
    const item = {
      id: uuidv4(),
      name: 'Test Item',
      parent: nonExistentParentId,
      type: 'dynamic'
    };

    const req = mockRequest(item);
    req.method = 'POST'; // Set method to POST for parent validation
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parent ID does not reference an existing page or item' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentParentId));
  });
  
  test('item creation with parent as another item should be valid', () => {
    // Create a parent item first
    const parentItemId = uuidv4();
    const parentItem = { id: parentItemId, name: 'Parent Item', type: 'dynamic', parent: uuidv4() };
    itemsMiddleware.getDataStore().set(parentItemId, parentItem);

    // Create a child item
    const childItem = {
      id: uuidv4(),
      name: 'Child Item',
      parent: parentItemId,
      type: 'dynamic'
    };

    const req = mockRequest(childItem);
    req.method = 'POST'; // Set method to POST for parent validation
    const res = mockResponse();

    itemsMiddleware.validateItem(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  
  test('getAllItems should return array of all items', () => {
    // Add a few items
    const item1 = { id: uuidv4(), name: 'Item 1', type: 'dynamic', parent: uuidv4() };
    const item2 = { id: uuidv4(), name: 'Item 2', type: 'static', parent: uuidv4() };
    itemsMiddleware.getDataStore().set(item1.id, item1);
    itemsMiddleware.getDataStore().set(item2.id, item2);

    const req = mockRequest();
    const res = mockResponse();

    itemsMiddleware.getAllItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([item1, item2]));
  });
  
  test('getItem should return item when it exists', () => {
    const itemId = uuidv4();
    const item = { id: itemId, name: 'Test Item', type: 'dynamic', parent: uuidv4() };
    itemsMiddleware.getDataStore().set(itemId, item);
    
    const req = mockRequest({}, { id: itemId });
    const res = mockResponse();
    
    itemsMiddleware.getItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(item);
  });
  
  test('getItem should return 404 for non-existent item', () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    itemsMiddleware.getItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
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
  
  test('updateItem should return 404 for non-existent item', () => {
    const nonExistentId = uuidv4();
    const updatedItem = { 
      id: nonExistentId, 
      name: 'Updated Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    const req = mockRequest(updatedItem, { id: nonExistentId });
    const res = mockResponse();

    itemsMiddleware.updateItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });
  
  test('deleteItem should remove item and return 204', () => {
    const itemId = uuidv4();
    const item = { 
      id: itemId, 
      name: 'Test Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    itemsMiddleware.getDataStore().set(itemId, item);
    
    const req = mockRequest({}, { id: itemId });
    const res = mockResponse();
    
    itemsMiddleware.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(itemsMiddleware.getDataStore().has(itemId)).toBe(false);
  });
  
  test('deleteItem should return 404 for non-existent item', () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    itemsMiddleware.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });
  
  test('getRouter should return router instance', () => {
    const router = itemsMiddleware.getRouter();
    expect(router).toBeDefined();
  });
});