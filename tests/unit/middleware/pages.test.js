/**
 * Unit tests for Pages middleware (uses database adapter)
 */
import PagesMiddleware from '../../../src/middleware/pages.js';
import { PagesRepository } from '../../../src/services/database/repository.js';
import { InMemoryAdapter } from '../../../src/services/database/memory-adapter.js';
import { v4 as uuidv4 } from 'uuid';

// Mock Express request and response objects
const mockRequest = (data = {}) => {
  return {
    body: data.body || {},
    params: data.params || {},
    method: data.method || 'GET',
    ...data
  };
};

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

describe('PagesMiddleware with database', () => {
  let pagesMiddleware;
  let repository;
  let adapter;

  beforeEach(async () => {
    // Setup InMemoryAdapter and PagesRepository
    adapter = new InMemoryAdapter();
    await adapter.connect();
    repository = new PagesRepository(adapter);

    // Create PagesMiddleware with repository
    pagesMiddleware = new PagesMiddleware(mockLogger, repository);
  });

  afterEach(async () => {
    await adapter.disconnect();
    jest.clearAllMocks();
  });

  describe('validatePage middleware', () => {
    test('should validate a valid page', async () => {
      const req = mockRequest({
        body: {
          id: uuidv4(),
          title: 'Test Page',
          isRoot: true,
          slug: ''
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      pagesMiddleware.validatePage(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject a page without ID', async () => {
      const req = mockRequest({
        body: {
          title: 'Invalid Page'
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      pagesMiddleware.validatePage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('ID is required')
      }));
    });

    test('should reject a page with invalid UUID', async () => {
      const req = mockRequest({
        body: {
          id: 'not-a-uuid',
          title: 'Invalid Page'
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      pagesMiddleware.validatePage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Invalid UUID')
      }));
    });

    test('should reject a root page with a parent', async () => {
      const req = mockRequest({
        body: {
          id: uuidv4(),
          title: 'Invalid Page',
          isRoot: true,
          parent: uuidv4(),
          slug: ''
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      pagesMiddleware.validatePage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('root page cannot have a parent')
      }));
    });

    test('should reject a non-root page without a parent', async () => {
      const req = mockRequest({
        body: {
          id: uuidv4(),
          title: 'Invalid Page',
          isRoot: false,
          slug: 'test-page'
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      pagesMiddleware.validatePage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Non-root pages must have a parent')
      }));
    });
  });

  describe('validateRootPage middleware', () => {
    test('should allow creating a root page when none exists', async () => {
      const req = mockRequest({
        method: 'POST',
        body: {
          id: uuidv4(),
          title: 'Root Page',
          isRoot: true,
          slug: ''
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      await pagesMiddleware.validateRootPage(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject creating a root page when one already exists', async () => {
      // Create a root page first
      const rootPageId = uuidv4();
      await repository.create({
        id: rootPageId,
        title: 'Existing Root Page',
        isRoot: true,
        slug: ''
      });

      const req = mockRequest({
        method: 'POST',
        body: {
          id: uuidv4(),
          title: 'Another Root Page',
          isRoot: true,
          slug: ''
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      await pagesMiddleware.validateRootPage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('A root page already exists')
      }));
    });

    test('should not check for root page when not creating a root page', async () => {
      const req = mockRequest({
        method: 'POST',
        body: {
          id: uuidv4(),
          title: 'Normal Page',
          isRoot: false,
          parent: uuidv4(),
          slug: 'normal-page'
        }
      });

      const res = mockResponse();
      const next = jest.fn();

      await pagesMiddleware.validateRootPage(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    test('should create a page', async () => {
      const pageId = uuidv4();
      const req = mockRequest({
        body: {
          id: pageId,
          title: 'New Page',
          isRoot: true,
          slug: ''
        }
      });

      const res = mockResponse();

      await pagesMiddleware.createPage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        id: pageId
      }));

      // Verify page was actually created in repository
      const page = await repository.getById(pageId);
      expect(page).not.toBeNull();
      expect(page.id).toBe(pageId);
    });

    test('should get all pages', async () => {
      // Create some pages first
      await repository.create({
        id: uuidv4(),
        title: 'Page 1',
        isRoot: true,
        slug: ''
      });

      await repository.create({
        id: uuidv4(),
        title: 'Page 2',
        isRoot: false,
        parent: uuidv4(),
        slug: 'page-2'
      });

      const req = mockRequest();
      const res = mockResponse();

      await pagesMiddleware.getAllPages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ title: 'Page 1' }),
        expect.objectContaining({ title: 'Page 2' })
      ]));
    });

    test('should get a specific page', async () => {
      // Create a page first
      const pageId = uuidv4();
      await repository.create({
        id: pageId,
        title: 'Specific Page',
        isRoot: true,
        slug: ''
      });

      const req = mockRequest({
        params: { id: pageId }
      });
      const res = mockResponse();

      await pagesMiddleware.getPage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: pageId,
        title: 'Specific Page'
      }));
    });

    test('should return 404 for non-existent page', async () => {
      const req = mockRequest({
        params: { id: uuidv4() }
      });
      const res = mockResponse();

      await pagesMiddleware.getPage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('not found')
      }));
    });

    test('should update a page', async () => {
      // Create a page first
      const pageId = uuidv4();
      await repository.create({
        id: pageId,
        title: 'Original Title',
        isRoot: true,
        slug: ''
      });

      const req = mockRequest({
        params: { id: pageId },
        body: {
          id: pageId,
          title: 'Updated Title',
          isRoot: true,
          slug: ''
        }
      });
      const res = mockResponse();

      await pagesMiddleware.updatePage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));

      // Verify page was actually updated in repository
      const page = await repository.getById(pageId);
      expect(page.title).toBe('Updated Title');
    });

    test('should delete a page', async () => {
      // Create a page first
      const pageId = uuidv4();
      await repository.create({
        id: pageId,
        title: 'Page to Delete',
        isRoot: true,
        slug: ''
      });

      const req = mockRequest({
        params: { id: pageId }
      });
      const res = mockResponse();

      await pagesMiddleware.deletePage(req, res);

      expect(res.status).toHaveBeenCalledWith(204);

      // Verify page was actually deleted from repository
      const exists = await repository.exists(pageId);
      expect(exists).toBe(false);
    });

    test('should not allow deleting a root page with children', async () => {
      // Create a root page
      const rootPageId = uuidv4();
      await repository.create({
        id: rootPageId,
        title: 'Root Page',
        isRoot: true,
        slug: ''
      });

      // Create a child page
      await repository.create({
        id: uuidv4(),
        title: 'Child Page',
        isRoot: false,
        parent: rootPageId,
        slug: 'child'
      });

      const req = mockRequest({
        params: { id: rootPageId }
      });
      const res = mockResponse();

      await pagesMiddleware.deletePage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Cannot delete the root page while it has child pages')
      }));

      // Verify root page still exists
      const exists = await repository.exists(rootPageId);
      expect(exists).toBe(true);
    });
  });
});
