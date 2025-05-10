/**
 * Pages API Middleware
 */
import { Router } from 'express';
import { isValidUUID } from './utils.js';
import { validateApiKey } from './auth.js';
import { validateIdMatch } from './validation.js';

class PagesMiddleware {
  constructor(logger) {
    this.router = Router();
    this.logger = logger;
    this.pages = new Map();
    this.setupRoutes();
  }
  
  /**
   * Find the root page
   * @returns {Object|null} The root page or null if not found
   */
  findRootPage() {
    return Array.from(this.pages.values()).find(page => page.isRoot === true);
  }

  /**
   * Find all child pages for a given parent ID
   * @param {string} parentId - The parent page ID
   * @returns {Array} Array of child pages
   */
  findChildPages(parentId) {
    return Array.from(this.pages.values()).filter(page => page.parent === parentId);
  }

  /**
   * Check if a page has any children
   * @param {string} pageId - The page ID to check
   * @returns {boolean} True if the page has children
   */
  hasChildren(pageId) {
    return this.findChildPages(pageId).length > 0;
  }

  /**
   * Validation middleware for Pages
   */
  validatePage = (req, res, next) => {
    const page = req.body;

    // Check required fields
    if (!page.id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    // Validate UUID format
    if (!isValidUUID(page.id)) {
      return res.status(400).json({ error: 'Invalid UUID format for page ID' });
    }

    // Validate isRoot field
    if (page.isRoot !== undefined && typeof page.isRoot !== 'boolean') {
      return res.status(400).json({ error: 'isRoot must be a boolean' });
    }

    // Check if there's already a root page when creating a new root page
    if (page.isRoot === true && req.method === 'POST') {
      const existingRootPage = this.findRootPage();
      
      if (existingRootPage && existingRootPage.id !== page.id) {
        return res.status(400).json({ 
          error: 'A root page already exists. Only one root page is allowed.' 
        });
      }
    }

    // A root page cannot have a parent
    if (page.isRoot === true && page.parent) {
      return res.status(400).json({ error: 'A root page cannot have a parent' });
    }

    // Non-root pages must have a parent
    if (page.isRoot === false && !page.parent) {
      return res.status(400).json({ error: 'Non-root pages must have a parent' });
    }
    
    // Root page must have an empty slug
    if (page.isRoot === true && page.slug && page.slug !== '') {
      return res.status(400).json({ error: 'Root page must have an empty slug or no slug property' });
    }
    
    // Non-root pages must have a non-empty slug
    if (page.isRoot === false && (!page.slug || page.slug === '')) {
      return res.status(400).json({ error: 'Non-root pages must have a non-empty slug' });
    }

    // Validate parent UUID if provided
    if (page.parent && !isValidUUID(page.parent)) {
      return res.status(400).json({ error: 'Invalid UUID format for parent ID' });
    }

    // Validate slug format if provided
    if (page.slug && typeof page.slug !== 'string') {
      return res.status(400).json({ error: 'Slug must be a string' });
    }

    // Validate slug format (allow only letters, numbers, hyphens, and underscores)
    if (page.slug && !/^[a-z0-9-_]+$/i.test(page.slug)) {
      return res.status(400).json({ error: 'Slug can only contain letters, numbers, hyphens, and underscores' });
    }

    // Validate metadata keywords if provided
    if (page.metadata && page.metadata.keywords && !Array.isArray(page.metadata.keywords)) {
      return res.status(400).json({ error: 'Metadata keywords must be an array' });
    }

    // Ensure items is an array if provided
    if (page.items && !Array.isArray(page.items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    next();
  };

  // Using validateIdMatch from validation.js module

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Apply API key validation to all routes
    this.router.use(validateApiKey);

    // Routes for Pages
    this.router.post('/', this.validatePage, this.createPage.bind(this));
    this.router.put('/:id', this.validatePage, validateIdMatch, this.updatePage.bind(this));
    this.router.delete('/:id', this.deletePage.bind(this));
    this.router.get('/:id', this.getPage.bind(this));
    this.router.get('/', this.getAllPages.bind(this));
  }

  /**
   * Get all pages
   */
  getAllPages(req, res) {
    const pagesArray = Array.from(this.pages.values());
    res.status(200).json(pagesArray);
  }

  /**
   * Get a specific page
   */
  getPage(req, res) {
    const id = req.params.id;
    
    if (!this.pages.has(id)) {
      this.logger.warn(`Page not found with ID: ${id}`);
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const page = this.pages.get(id);
    res.status(200).json(page);
  }

  /**
   * Handle page creation
   */
  createPage(req, res) {
    const page = req.body;
    this.pages.set(page.id, page);
    
    this.logger.info(`Created page with ID: ${page.id}`);
    res.status(201).json({ success: true, id: page.id });
  }

  /**
   * Handle page update
   */
  updatePage(req, res) {
    const id = req.params.id;
    
    if (!this.pages.has(id)) {
      this.logger.warn(`Page not found with ID: ${id}`);
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const page = req.body;
    this.pages.set(id, page);
    
    this.logger.info(`Updated page with ID: ${id}`);
    res.status(200).json({ success: true });
  }

  /**
   * Handle page deletion
   */
  deletePage(req, res) {
    const id = req.params.id;
    
    if (!this.pages.has(id)) {
      this.logger.warn(`Page not found with ID: ${id}`);
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const page = this.pages.get(id);
    
    // Check if it's the root page with children
    if (page.isRoot === true && this.hasChildren(id)) {
      this.logger.warn(`Cannot delete root page with children: ${id}`);
      return res.status(400).json({ 
        error: 'Cannot delete the root page while it has child pages. Delete all child pages first.' 
      });
    }
    
    this.pages.delete(id);
    
    this.logger.info(`Deleted page with ID: ${id}`);
    res.status(204).send();
  }

  /**
   * Check if a page exists (used by other middlewares)
   */
  hasPage(id) {
    return this.pages.has(id);
  }

  /**
   * Get the router middleware
   */
  getRouter() {
    return this.router;
  }

  /**
   * Get the data store (for testing)
   */
  getDataStore() {
    return this.pages;
  }
}

export default PagesMiddleware;