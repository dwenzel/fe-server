/**
 * Pages Router for frontend endpoints and hierarchical slug-based routing
 */
import { Router } from 'express';
import logger from '../services/logger.js';
import { createSlugResolver } from '../middleware/pages/index.js';
import { determineResponseFormat } from '../utils/content-negotiation.js';
import { getById, findRootPage, findChildPages, getAll } from '../utils/db-compatibility.js';

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
  pagesRouter.get('/api/v1/pages/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const pageExists = await pagesMiddleware.hasPage(id);
      if (!pageExists) {
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

      const page = await pagesMiddleware.repository.getById(id);

      // Determine format (JSON or HTML)
      const format = determineResponseFormat(req);

    if (format === 'html') {
      try {
        // Add current date for template
        const currentYear = new Date().getFullYear();

        // Get parent page if this is a child page
        let parentPage = null;
        if (page.parent && !page.isRoot) {
          parentPage = await pagesMiddleware.repository.getById(page.parent);
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
    } catch (error) {
      logger.error(`Error retrieving page: ${error.message}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Route for pages list
  pagesRouter.get('/api/v1/pages', async (req, res) => {
    try {
      const pagesArray = await pagesMiddleware.repository.getAll();

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
    } catch (error) {
      logger.error(`Error retrieving pages list: ${error.message}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Routes for items
  pagesRouter.get('/api/v1/items/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const itemExists = await itemsMiddleware.hasItem(id);
      if (!itemExists) {
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

      const item = await itemsMiddleware.repository.getById(id);

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
    } catch (error) {
      logger.error(`Error retrieving item: ${error.message}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Route for items list
  pagesRouter.get('/api/v1/items', async (req, res) => {
    try {
      const itemsArray = await itemsMiddleware.repository.getAll();

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
    } catch (error) {
      logger.error(`Error retrieving items list: ${error.message}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Generic page rendering function (used by both root and non-root routes)
  // This function has been updated to support both sync and async database access patterns
  const renderResolvedPage = async (req, res) => {
    // Enhanced debug logging
    logger.info(`renderResolvedPage handling request path: "${req.path}"`);
    logger.info(`Request query params: ${JSON.stringify(req.query)}`);
    logger.info(`resolvedPage set: ${req.resolvedPage ? 'YES' : 'NO'}`);

    if (req.resolvedPage) {
      const pageInfo = req.resolvedPage.name || req.resolvedPage.title || 'Unknown';
      logger.info(`Resolved page details: ID=${req.resolvedPage.id}, slug="${req.resolvedPage.slug}", name="${pageInfo}"`);
    }

    try {
      // Check if slug was resolved to a page
      if (!req.resolvedPage) {
        logger.warn(`No page found for path: ${req.path}`);

        try {
          // Log current pages for debugging using compatibility function
          const pagesArray = await getAll(pagesMiddleware);
          logger.info(`Available pages (${pagesArray.length}):`);
          pagesArray.forEach(p => {
            const pageName = p.name || p.title || 'Unknown';
            logger.info(`  Page: ID=${p.id}, slug="${p.slug}", parent=${p.parent || 'none'}, name="${pageName}"`);
          });
        } catch (error) {
          logger.error(`Error retrieving pages for debug logging: ${error.message}`);
        }

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
            parentPage = await getById(pagesMiddleware, page.parent);
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
    } catch (error) {
      logger.error(`Error in renderResolvedPage: ${error.message}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Root page route
  pagesRouter.get('/', renderResolvedPage);

  // Define routes for slug-based paths
  // Single level route
  pagesRouter.get('/:slug', renderResolvedPage);

  // Two-level nested route
  pagesRouter.get('/:parent/:child', renderResolvedPage);

  // Three-level nested route (if needed)
  pagesRouter.get('/:parent/:child/:grandchild', renderResolvedPage);

  // Keep this as a fallback, but the more specific routes above should handle most cases
  pagesRouter.use(renderResolvedPage);

  // Error handling middleware
  pagesRouter.use((err, req, res) => {
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
