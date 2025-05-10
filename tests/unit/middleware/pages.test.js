/**
 * Unit tests for PagesMiddleware
 */
import PagesMiddleware from '../../../src/middleware/pages.js';
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
    mockLogger.info.mockClear();
    mockLogger.warn.mockClear();
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
  
  test('validatePage should pass valid root page with empty slug', () => {
    const validRootPage = {
      id: uuidv4(),
      name: 'Root Page',
      isRoot: true,
      slug: ''
    };

    const req = mockRequest(validRootPage);
    req.method = 'POST';
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
  
  test('validatePage should reject root page with non-empty slug', () => {
    const invalidRootPage = {
      id: uuidv4(),
      name: 'Invalid Root Page',
      isRoot: true,
      slug: 'not-empty'
    };

    const req = mockRequest(invalidRootPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Root page must have an empty slug or no slug property' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validatePage should reject non-root page with empty slug', () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Page',
      isRoot: false,
      slug: '',
      parent: uuidv4()
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Non-root pages must have a non-empty slug' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validatePage should reject root page with parent', () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Root Page',
      isRoot: true,
      slug: '',
      parent: uuidv4()
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'A root page cannot have a parent' });
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validatePage should reject non-root page without parent', () => {
    const invalidPage = {
      id: uuidv4(),
      name: 'Invalid Page',
      isRoot: false,
      slug: 'some-slug'
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Non-root pages must have a parent' });
    expect(mockNext).not.toHaveBeenCalled();
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
  
  test('validatePage should reject page with invalid parent UUID', () => {
    const invalidPage = {
      id: uuidv4(),
      parent: 'not-a-uuid'
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid UUID format for parent ID' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('validatePage should reject page with non-array metadata keywords', () => {
    const invalidPage = {
      id: uuidv4(),
      metadata: {
        keywords: 'not-an-array'
      }
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Metadata keywords must be an array' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('validatePage should reject page with non-array items', () => {
    const invalidPage = {
      id: uuidv4(),
      items: 'not-an-array'
    };

    const req = mockRequest(invalidPage);
    const res = mockResponse();

    pagesMiddleware.validatePage(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Items must be an array' });
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
  
  test('getAllPages should return array of all pages', () => {
    // Add a few pages
    const page1 = { id: uuidv4(), name: 'Page 1' };
    const page2 = { id: uuidv4(), name: 'Page 2' };
    pagesMiddleware.getDataStore().set(page1.id, page1);
    pagesMiddleware.getDataStore().set(page2.id, page2);

    const req = mockRequest();
    const res = mockResponse();

    pagesMiddleware.getAllPages(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([page1, page2]));
  });

  test('getPage should return 404 for non-existent page', () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    pagesMiddleware.getPage(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Page not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });
  
  test('getPage should return page when it exists', () => {
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Test Page' };
    pagesMiddleware.getDataStore().set(pageId, page);
    
    const req = mockRequest({}, { id: pageId });
    const res = mockResponse();
    
    pagesMiddleware.getPage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(page);
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
  
  test('updatePage should return 404 for non-existent page', () => {
    const nonExistentId = uuidv4();
    const updatedPage = { id: nonExistentId, name: 'Updated Page' };
    const req = mockRequest(updatedPage, { id: nonExistentId });
    const res = mockResponse();

    pagesMiddleware.updatePage(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Page not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
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
  
  test('deletePage should block deletion of root page with children', () => {
    // Create a root page
    const rootId = uuidv4();
    const rootPage = { id: rootId, name: 'Root Page', isRoot: true };
    pagesMiddleware.getDataStore().set(rootId, rootPage);
    
    // Create a child page
    const childId = uuidv4();
    const childPage = { id: childId, name: 'Child Page', parent: rootId };
    pagesMiddleware.getDataStore().set(childId, childPage);
    
    const req = mockRequest({}, { id: rootId });
    const res = mockResponse();
    
    pagesMiddleware.deletePage(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Cannot delete the root page while it has child pages. Delete all child pages first.' 
    });
    expect(pagesMiddleware.hasPage(rootId)).toBe(true);
  });
  
  test('deletePage should return 404 for non-existent page', () => {
    const nonExistentId = uuidv4();
    const req = mockRequest({}, { id: nonExistentId });
    const res = mockResponse();

    pagesMiddleware.deletePage(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Page not found' });
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(nonExistentId));
  });
  
  test('getRouter should return router instance', () => {
    const router = pagesMiddleware.getRouter();
    expect(router).toBeDefined();
  });
  
  test('findRootPage should return the root page', () => {
    // Create a few pages, including a root page
    const rootPage = { id: uuidv4(), name: 'Root Page', isRoot: true };
    const page1 = { id: uuidv4(), name: 'Page 1' };
    const page2 = { id: uuidv4(), name: 'Page 2' };
    
    pagesMiddleware.getDataStore().set(rootPage.id, rootPage);
    pagesMiddleware.getDataStore().set(page1.id, page1);
    pagesMiddleware.getDataStore().set(page2.id, page2);
    
    const result = pagesMiddleware.findRootPage();
    expect(result).toEqual(rootPage);
  });
  
  test('findRootPage should return null if no root page exists', () => {
    // Create a few non-root pages
    const page1 = { id: uuidv4(), name: 'Page 1' };
    const page2 = { id: uuidv4(), name: 'Page 2' };
    
    pagesMiddleware.getDataStore().set(page1.id, page1);
    pagesMiddleware.getDataStore().set(page2.id, page2);
    
    const result = pagesMiddleware.findRootPage();
    expect(result).toBeUndefined();
  });
  
  test('findChildPages should return all child pages for a parent', () => {
    // Create a parent page
    const parentId = uuidv4();
    const parentPage = { id: parentId, name: 'Parent Page' };
    
    // Create child pages
    const child1 = { id: uuidv4(), name: 'Child 1', parent: parentId };
    const child2 = { id: uuidv4(), name: 'Child 2', parent: parentId };
    
    // Create an unrelated page
    const unrelatedPage = { id: uuidv4(), name: 'Unrelated Page' };
    
    pagesMiddleware.getDataStore().set(parentId, parentPage);
    pagesMiddleware.getDataStore().set(child1.id, child1);
    pagesMiddleware.getDataStore().set(child2.id, child2);
    pagesMiddleware.getDataStore().set(unrelatedPage.id, unrelatedPage);
    
    const children = pagesMiddleware.findChildPages(parentId);
    expect(children).toHaveLength(2);
    expect(children).toEqual(expect.arrayContaining([child1, child2]));
  });
  
  test('hasChildren should return true when page has children', () => {
    // Create a parent page
    const parentId = uuidv4();
    const parentPage = { id: parentId, name: 'Parent Page' };
    
    // Create a child page
    const childId = uuidv4();
    const childPage = { id: childId, name: 'Child Page', parent: parentId };
    
    pagesMiddleware.getDataStore().set(parentId, parentPage);
    pagesMiddleware.getDataStore().set(childId, childPage);
    
    expect(pagesMiddleware.hasChildren(parentId)).toBe(true);
  });
  
  test('hasChildren should return false when page has no children', () => {
    // Create a page without children
    const pageId = uuidv4();
    const page = { id: pageId, name: 'Page Without Children' };
    
    pagesMiddleware.getDataStore().set(pageId, page);
    
    expect(pagesMiddleware.hasChildren(pageId)).toBe(false);
  });
});