/**
 * Unit tests for Items middleware (uses database adapter)
 */
import ItemsMiddleware from '../../../src/middleware/items.js';
import PagesMiddleware from '../../../src/middleware/pages.js';
import { ItemsRepository, PagesRepository } from '../../../src/services/database/repository.js';
import { InMemoryAdapter } from '../../../src/services/database/memory-adapter.js';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, beforeEach, afterEach, jest, expect } from "@jest/globals";

// Mock Express request and response objects
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

// Mock logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('ItemsMiddleware with database', () => {
  let pagesMiddleware, itemsMiddleware;
  let pagesRepository, itemsRepository;
  let adapter;

  beforeEach(async () => {
    // Setup InMemoryAdapter and repositories
    adapter = new InMemoryAdapter();
    await adapter.connect();
    pagesRepository = new PagesRepository(adapter);
    itemsRepository = new ItemsRepository(adapter);

    // Create middleware with repositories
    pagesMiddleware = new PagesMiddleware(mockLogger, pagesRepository);
    itemsMiddleware = new ItemsMiddleware(mockLogger, pagesMiddleware, itemsRepository);

    // Clear mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await adapter.disconnect();
  });

  test('validateItem should pass valid item', () => {
    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: uuidv4(),
      type: 'dynamic'
    };

    const req = mockRequest(validItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateItem should reject item without ID', () => {
    const invalidItem = {
      name: 'Invalid Item',
      parent: uuidv4(),
      type: 'dynamic'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item ID is required' });
    expect(next).not.toHaveBeenCalled();
  });

  test('validateItem should reject item without parent', () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      type: 'dynamic'
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parent ID is required' });
    expect(next).not.toHaveBeenCalled();
  });

  test('validateItem should reject item without type', () => {
    const invalidItem = {
      id: uuidv4(),
      name: 'Invalid Item',
      parent: uuidv4()
    };

    const req = mockRequest(invalidItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item type is required' });
    expect(next).not.toHaveBeenCalled();
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
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid UUID format for item ID' });
    expect(next).not.toHaveBeenCalled();
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
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
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
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Invalid status') }));
    expect(next).not.toHaveBeenCalled();
  });

  test('validateItem should pass with empty attributes', () => {
    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: uuidv4(),
      type: 'dynamic',
      attributes: {}
    };

    const req = mockRequest(validItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateItem should pass with valid status', () => {
    const validItem = {
      id: uuidv4(),
      name: 'Test Item',
      parent: uuidv4(),
      type: 'dynamic',
      attributes: {
        status: 'Option1'  // Using a valid status from config
      }
    };

    const req = mockRequest(validItem);
    const res = mockResponse();
    const next = jest.fn();

    itemsMiddleware.validateItem(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateParent should reject creation with non-existent parent', async () => {
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
    const next = jest.fn();

    await itemsMiddleware.validateParent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parent ID does not reference an existing page or item' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentParentId));
  });

  test('item creation with parent as another item should be valid', async () => {
    // Create a parent item first
    const parentItemId = uuidv4();
    const parentItem = { id: parentItemId, name: 'Parent Item', type: 'dynamic', parent: uuidv4() };
    await itemsRepository.create(parentItem);

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
    const next = jest.fn();

    await itemsMiddleware.validateParent(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('getAllItems should return array of all items', async () => {
    // Add a few items
    const item1 = { id: uuidv4(), name: 'Item 1', type: 'dynamic', parent: uuidv4() };
    const item2 = { id: uuidv4(), name: 'Item 2', type: 'static', parent: uuidv4() };
    await itemsRepository.create(item1);
    await itemsRepository.create(item2);

    const req = mockRequest();
    const res = mockResponse();

    await itemsMiddleware.getAllItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ name: 'Item 1' }),
      expect.objectContaining({ name: 'Item 2' })
    ]));
  });

  test('getItem should return item when it exists', async () => {
    const itemId = uuidv4();
    const item = { id: itemId, name: 'Test Item', type: 'dynamic', parent: uuidv4() };
    await itemsRepository.create(item);

    const req = mockRequest({}, { id: itemId });
    const res = mockResponse();

    await itemsMiddleware.getItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: itemId,
      name: 'Test Item'
    }));
  });

  test('getItem should return 404 for non-existent item', async () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    await itemsMiddleware.getItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });

  test('createItem should store item and return 201', async () => {
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

    await itemsMiddleware.createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      id: itemId
    }));

    // Verify item was stored
    const storedItem = await itemsRepository.getById(itemId);
    expect(storedItem).toEqual(expect.objectContaining(item));
  });

  test('updateItem should update existing item and return 200', async () => {
    // Create an item first
    const itemId = uuidv4();
    const originalItem = {
      id: itemId,
      name: 'Original Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    await itemsRepository.create(originalItem);

    // Update it
    const updatedItem = {
      id: itemId,
      name: 'Updated Item',
      parent: originalItem.parent,
      type: 'dynamic'
    };
    const req = mockRequest(updatedItem, { id: itemId });
    const res = mockResponse();

    await itemsMiddleware.updateItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Verify item was updated
    const storedItem = await itemsRepository.getById(itemId);
    expect(storedItem.name).toBe('Updated Item');
  });

  test('updateItem should return 404 for non-existent item', async () => {
    const nonExistentId = uuidv4();
    const updatedItem = {
      id: nonExistentId,
      name: 'Updated Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    const req = mockRequest(updatedItem, { id: nonExistentId });
    const res = mockResponse();

    await itemsMiddleware.updateItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });

  test('deleteItem should remove item and return 204', async () => {
    const itemId = uuidv4();
    const item = {
      id: itemId,
      name: 'Test Item',
      parent: uuidv4(),
      type: 'dynamic'
    };
    await itemsRepository.create(item);

    const req = mockRequest({}, { id: itemId });
    const res = mockResponse();

    await itemsMiddleware.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(204);

    // Verify item was deleted
    const exists = await itemsRepository.exists(itemId);
    expect(exists).toBe(false);
  });

  test('deleteItem should return 404 for non-existent item', async () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    await itemsMiddleware.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });

  test('getRouter should return router instance', () => {
    const router = itemsMiddleware.getRouter();
    expect(router).toBeDefined();
  });
});
