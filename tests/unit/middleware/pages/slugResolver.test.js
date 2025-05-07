/**
 * Tests for slug resolver middleware
 */
// Mock the logger
jest.mock('../../../../src/services/logger.js', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

import { createSlugResolver, parseSlugPath } from '../../../../src/middleware/pages/slugResolver.js';

describe('Slug Resolver Middleware', () => {
  describe('parseSlugPath', () => {
    test('should handle empty path', () => {
      expect(parseSlugPath('')).toEqual([]);
    });

    test('should handle path with leading and trailing slashes', () => {
      expect(parseSlugPath('/about/team/')).toEqual(['about', 'team']);
    });

    test('should handle path with multiple slashes', () => {
      expect(parseSlugPath('///about///team///')).toEqual(['about', 'team']);
    });

    test('should return empty array for root path', () => {
      expect(parseSlugPath('/')).toEqual([]);
    });
  });

  describe('slugResolver middleware', () => {
    let pagesMiddleware;
    let mockPages;

    // Setup mock pages middleware with a hierarchy of pages
    beforeEach(() => {
      mockPages = [
        { id: 'root-id', isRoot: true, slug: '' },
        { id: 'about-id', parent: 'root-id', slug: 'about' },
        { id: 'team-id', parent: 'about-id', slug: 'team' },
        { id: 'products-id', parent: 'root-id', slug: 'products' },
        { id: 'product1-id', parent: 'products-id', slug: 'widget-x' }
      ];

      pagesMiddleware = {
        findRootPage: jest.fn(() => mockPages.find(page => page.isRoot)),
        findChildPages: jest.fn(parentId => mockPages.filter(page => page.parent === parentId))
      };
    });

    test('should resolve root path to root page', () => {
      const slugResolver = createSlugResolver(pagesMiddleware);
      const req = { path: '/' };
      const res = {};
      const next = jest.fn();

      slugResolver(req, res, next);

      expect(pagesMiddleware.findRootPage).toHaveBeenCalled();
      expect(req.resolvedPage).toEqual(mockPages[0]);
      expect(next).toHaveBeenCalled();
    });

    test('should resolve first-level slug path correctly', () => {
      const slugResolver = createSlugResolver(pagesMiddleware);
      const req = { path: '/about' };
      const res = {};
      const next = jest.fn();

      slugResolver(req, res, next);

      expect(pagesMiddleware.findRootPage).toHaveBeenCalled();
      expect(pagesMiddleware.findChildPages).toHaveBeenCalledWith('root-id');
      expect(req.resolvedPage).toEqual(mockPages[1]);
      expect(next).toHaveBeenCalled();
    });

    test('should resolve nested slug path correctly', () => {
      const slugResolver = createSlugResolver(pagesMiddleware);
      const req = { path: '/about/team' };
      const res = {};
      const next = jest.fn();

      slugResolver(req, res, next);

      expect(pagesMiddleware.findRootPage).toHaveBeenCalled();
      expect(pagesMiddleware.findChildPages).toHaveBeenCalledWith('root-id');
      expect(pagesMiddleware.findChildPages).toHaveBeenCalledWith('about-id');
      expect(req.resolvedPage).toEqual(mockPages[2]);
      expect(next).toHaveBeenCalled();
    });

    test('should handle non-existent slug path', () => {
      const slugResolver = createSlugResolver(pagesMiddleware);
      const req = { path: '/non-existent' };
      const res = {};
      const next = jest.fn();

      slugResolver(req, res, next);

      expect(pagesMiddleware.findRootPage).toHaveBeenCalled();
      expect(pagesMiddleware.findChildPages).toHaveBeenCalledWith('root-id');
      expect(req.resolvedPage).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    test('should handle path with query parameters', () => {
      const slugResolver = createSlugResolver(pagesMiddleware);
      const req = { path: '/about?param=value' };
      const res = {};
      const next = jest.fn();

      slugResolver(req, res, next);

      expect(pagesMiddleware.findRootPage).toHaveBeenCalled();
      expect(pagesMiddleware.findChildPages).toHaveBeenCalledWith('root-id');
      expect(req.resolvedPage).toEqual(mockPages[1]);
      expect(next).toHaveBeenCalled();
    });
  });
});