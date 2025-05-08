/**
 * Pages Router for frontend endpoints and hierarchical slug-based routing
 */
import { Router } from 'express';
import logger from '../services/logger.js';
import { createSlugResolver } from '../middleware/pages/index.js';
import { determineResponseFormat } from '../utils/content-negotiation.js';
import config from '../config.js';

/**
 * Creates and configures the Pages router
 * @param {Object} pagesMiddleware - Pages middleware instance
 * @param {Object} itemsMiddleware - Items middleware instance
 * @param {Object} templateRenderer - Template renderer instance
 * @returns {Router} Configured Express router
 */
export function createPagesRouter(pagesMiddleware, itemsMiddleware, templateRenderer) {
  const pagesRouter = Router();
  
  // Create slug resolver middleware
  const slugResolver = createSlugResolver(pagesMiddleware);
  
  // Apply slug resolver to all routes
  pagesRouter.use(slugResolver);
  
  // Routes for pages with ID
  pagesRouter.get('/api/v1/pages/:id', (req, res) => {
    const id = req.params.id;
    
    if (!pagesMiddleware.hasPage(id)) {
      logger.warn(`Page not found with ID: ${id}`);
      
      // Decide format for error response
      const format = determineResponseFormat(req);
      
      if (format === 'html') {
        // Render error page
        try {
          const html = templateRenderer.renderError('Page not found', 404);
          return res.status(404).send(html);
        } catch (error) {
          logger.error(`Error rendering error page: ${error.message}`, error);
          return res.status(404).json({ error: 'Page not found' });
        }
      } else {
        return res.status(404).json({ error: 'Page not found' });
      }
    }
    
    const page = pagesMiddleware.getDataStore().get(id);
    
    // Determine format (JSON or HTML)
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      try {
        // Add current date for template
        const currentYear = new Date().getFullYear();
        
        // Get parent page if this is a child page
        let parentPage = null;
        if (page.parent && !page.isRoot) {
          parentPage = pagesMiddleware.getDataStore().get(page.parent);
        }
        
        // Render with the appropriate template
        const html = templateRenderer.renderPage({
          ...page,
          currentYear
        }, {
          engine: req.query.engine,
          req,
          parentPage,
          pagesMiddleware // Pass pagesMiddleware for hierarchy
        });
        
        res.status(200).type('html').send(html);
      } catch (error) {
        logger.error(`Error rendering page: ${error.message}`, error);
        res.status(500).json({ error: 'Failed to render page' });
      }
    } else {
      // Default to JSON response
      res.status(200).json(page);
    }
  });
  
  // Route for pages list
  pagesRouter.get('/api/v1/pages', (req, res) => {
    const pagesArray = Array.from(pagesMiddleware.getDataStore().values());
    
    // Determine format (JSON or HTML)
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      try {
        // Transform pages array for template rendering
        const templateData = {
          title: 'All Pages',
          pages: pagesArray,
          meta: {
            title: 'All Pages',
            description: 'List of all pages in the Frontend Server'
          }
        };
        
        // Render with the appropriate template
        const html = templateRenderer.renderContent(templateData, 'page', {
          template: 'pages/list',
          engine: req.query.engine
        });
        
        res.status(200).type('html').send(html);
      } catch (error) {
        logger.error(`Error rendering pages list: ${error.message}`, error);
        res.status(500).json({ error: 'Failed to render pages list' });
      }
    } else {
      // Default to JSON response
      res.status(200).json(pagesArray);
    }
  });
  
  // Routes for items
  pagesRouter.get('/api/v1/items/:id', (req, res) => {
    const id = req.params.id;
    
    const item = itemsMiddleware.getDataStore().get(id);
    if (!item) {
      logger.warn(`Item not found with ID: ${id}`);
      
      // Decide format for error response
      const format = determineResponseFormat(req);
      
      if (format === 'html') {
        // Render error page
        try {
          const html = templateRenderer.renderError('Item not found', 404);
          return res.status(404).send(html);
        } catch (error) {
          logger.error(`Error rendering error page: ${error.message}`, error);
          return res.status(404).json({ error: 'Item not found' });
        }
      } else {
        return res.status(404).json({ error: 'Item not found' });
      }
    }
    
    // Determine format (JSON or HTML)
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      try {
        // Add current date for template
        const currentYear = new Date().getFullYear();
        
        // Render with the appropriate template
        const html = templateRenderer.renderItem({
          ...item,
          currentYear
        }, {
          engine: req.query.engine,
          req
        });
        
        res.status(200).type('html').send(html);
      } catch (error) {
        logger.error(`Error rendering item: ${error.message}`, error);
        res.status(500).json({ error: 'Failed to render item' });
      }
    } else {
      // Default to JSON response
      res.status(200).json(item);
    }
  });
  
  // Route for items list
  pagesRouter.get('/api/v1/items', (req, res) => {
    const itemsArray = Array.from(itemsMiddleware.getDataStore().values());
    
    // Determine format (JSON or HTML)
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      try {
        // Transform items array for template rendering
        const templateData = {
          title: 'All Items',
          items: itemsArray,
          meta: {
            title: 'All Items',
            description: 'List of all items in the Frontend Server'
          }
        };
        
        // Render with the appropriate template
        const html = templateRenderer.renderContent(templateData, 'item', {
          template: 'items/list',
          engine: req.query.engine
        });
        
        res.status(200).type('html').send(html);
      } catch (error) {
        logger.error(`Error rendering items list: ${error.message}`, error);
        res.status(500).json({ error: 'Failed to render items list' });
      }
    } else {
      // Default to JSON response
      res.status(200).json(itemsArray);
    }
  });
  
  // Generic page rendering function (used by both root and non-root routes)
  const renderResolvedPage = (req, res) => {
    // Enhanced debug logging
    logger.debug(`renderResolvedPage handling request path: "${req.path}"`);
    logger.debug(`Request query params: ${JSON.stringify(req.query)}`);
    logger.debug(`resolvedPage set: ${req.resolvedPage ? 'YES' : 'NO'}`);
    
    if (req.resolvedPage) {
      logger.debug(`Resolved page details: ID=${req.resolvedPage.id}, slug="${req.resolvedPage.slug}", name="${req.resolvedPage.name}"`);
    }
    
    // Check if slug was resolved to a page
    if (!req.resolvedPage) {
      logger.warn(`No page found for path: ${req.path}`);
      
      // Log current pages for debugging
      const pagesArray = Array.from(pagesMiddleware.getDataStore().values());
      logger.debug(`Available pages (${pagesArray.length}):`);
      pagesArray.forEach(p => {
        logger.debug(`  Page: ID=${p.id}, slug="${p.slug}", parent=${p.parent || 'none'}, name="${p.name}"`);
      });
      
      // Decide format for error response
      const format = determineResponseFormat(req);
      
      if (format === 'html') {
        // Render error page
        try {
          const html = templateRenderer.renderError('Page not found', 404);
          return res.status(404).send(html);
        } catch (error) {
          logger.error(`Error rendering error page: ${error.message}`, error);
          return res.status(404).json({ error: 'Page not found' });
        }
      } else {
        return res.status(404).json({ error: 'Page not found' });
      }
    }
    
    const page = req.resolvedPage;
    
    // Determine format (JSON or HTML)
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      try {
        // Add current date for template
        const currentYear = new Date().getFullYear();
        
        // Get parent page if this is a child page
        let parentPage = null;
        if (page.parent && !page.isRoot) {
          parentPage = pagesMiddleware.getDataStore().get(page.parent);
        }
        
        // Render with the appropriate template
        const html = templateRenderer.renderPage({
          ...page,
          currentYear
        }, {
          engine: req.query.engine,
          req,
          parentPage,
          pagesMiddleware // Pass pagesMiddleware for hierarchy
        });
        
        res.status(200).type('html').send(html);
      } catch (error) {
        logger.error(`Error rendering page: ${error.message}`, error);
        res.status(500).json({ error: 'Failed to render page' });
      }
    } else {
      // Default to JSON response
      res.status(200).json(page);
    }
  };
  
  // Root page route
  pagesRouter.get('/', renderResolvedPage);
  
  // Define more specific routes for slug-based paths
  // This route will catch both first-level and deeper hierarchical paths
  pagesRouter.get('/:slug*', renderResolvedPage);
  
  // Keep this as a fallback, but the more specific routes above should handle most cases
  pagesRouter.use(renderResolvedPage);
  
  // Error handling middleware
  pagesRouter.use((err, req, res, next) => {
    logger.error(`Pages router error: ${err.stack}`);
    
    // Decide format for error response
    const format = determineResponseFormat(req);
    
    if (format === 'html') {
      // Render error page
      try {
        const html = templateRenderer.renderError('An error occurred', 500);
        return res.status(500).send(html);
      } catch (error) {
        logger.error(`Error rendering error page: ${error.message}`, error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  return pagesRouter;
}