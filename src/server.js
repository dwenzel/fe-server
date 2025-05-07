/**
 * Main Express server setup
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './services/logger.js';
import config from './config.js';
import templateConfig from './config/templates.js';
import PagesMiddleware from './middleware/pages.js';
import ItemsMiddleware from './middleware/items.js';
import TemplateRenderer from './services/templates/template-renderer.js';

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create Express app
const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// Apply global middleware
app.use(cors());
app.use(bodyParser.json());

// Get API version from config
const apiVersion = config.api.version;

// Health check endpoint
app.get(`/api/${apiVersion}/health`, (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API version endpoint
app.get(`/api/${apiVersion}/version`, (req, res) => {
  res.status(200).json({
    version: apiVersion,
    server: 'Frontend Server API'
  });
});

// Create API middleware instances
const pagesMiddleware = new PagesMiddleware(logger);
const itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);

// Create template renderer
const templateRenderer = new TemplateRenderer(templateConfig, logger);
templateRenderer.ensureTemplateDirs();

// Helper function to determine response format
const determineResponseFormat = (req) => {
  // Check if explicit JSON format is requested in Accept header
  if (req.get('Accept') === 'application/json') {
    return 'json';
  }
  
  // Check query param first, then Accept header
  const formatFromQuery = req.query.format;
  const formatFromAccept = req.accepts(['html', 'json']);
  
  // Log for debugging
  logger.info(`Content negotiation - Query format: ${formatFromQuery}, Accept format: ${formatFromAccept}`);
  
  return formatFromQuery || formatFromAccept || 'json';
};

// Mount API routes with versioning
app.use(`/api/${apiVersion}/backend/pages`, pagesMiddleware.getRouter());
app.use(`/api/${apiVersion}/backend/items`, itemsMiddleware.getRouter());

// Public frontend routes for pages
app.get(`/api/${apiVersion}/frontend/pages`, (req, res) => {
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

// Helper function to find a page by slug
const findPageBySlug = (slug) => {
  const pages = pagesMiddleware.getDataStore();
  
  // Convert to array and find by slug
  return Array.from(pages.values()).find(page => page.slug === slug);
};

// Route for accessing pages by slug
app.get(`/api/${apiVersion}/frontend/pages/by-slug/:slug`, (req, res) => {
  const slug = req.params.slug;
  const page = findPageBySlug(slug);
  
  if (!page) {
    logger.warn(`Page not found with slug: ${slug}`);
    
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
  
  // Determine format (JSON or HTML)
  const format = determineResponseFormat(req);
  
  if (format === 'html') {
    try {
      // Add current date for template
      const currentYear = new Date().getFullYear();
      
      // Render with the appropriate template
      const html = templateRenderer.renderPage({
        ...page,
        currentYear
      }, {
        engine: req.query.engine,
        req
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

// Route for accessing pages by ID
app.get(`/api/${apiVersion}/frontend/pages/:id`, (req, res) => {
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
      
      // Render with the appropriate template
      const html = templateRenderer.renderPage({
        ...page,
        currentYear
      }, {
        engine: req.query.engine,
        req
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

// Public frontend routes for items
app.get(`/api/${apiVersion}/frontend/items`, (req, res) => {
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

app.get(`/api/${apiVersion}/frontend/items/:id`, (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info(`Server running on ${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

export default server;
