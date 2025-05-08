/**
 * Main Express server setup
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { watch } from 'fs';
import logger from './services/logger.js';
import config from './config.js';
import templateConfig from './config/templates.js';
import PagesMiddleware from './middleware/pages.js';
import ItemsMiddleware from './middleware/items.js';
import TemplateRenderer from './services/templates/template-renderer.js';
import { createApiRouter, createPagesRouter } from './routers/index.js';

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const resetMarkerPath = path.join(dataDir, 'reset-server.marker');

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

// Create API middleware instances
let pagesMiddleware = new PagesMiddleware(logger);
let itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);

// Create template renderer
let templateRenderer = new TemplateRenderer(templateConfig, logger);
templateRenderer.ensureTemplateDirs();

// Create routers
let apiRouter;
let pagesRouter;

// Function to create/recreate routers with current middleware instances
function setupRouters() {
  // Create our routers
  apiRouter = createApiRouter(pagesMiddleware, itemsMiddleware);
  pagesRouter = createPagesRouter(pagesMiddleware, itemsMiddleware, templateRenderer);
  
  // Remove existing routes if app._router exists
  if (app._router && app._router.stack) {
    logger.debug('Cleaning up existing router stack before reconfiguration');
    app._router.stack = app._router.stack.filter(layer => {
      return layer.name !== 'router' || 
             (layer.regexp && !layer.regexp.test(`/api/${apiVersion}`) && 
              layer.regexp && !layer.regexp.test('/'));
    });
  }
  
  // Reset middlewares to re-mount routers
  app._router = undefined;
  
  // IMPORTANT: Order matters for routing. Mount the pages router first
  // so slug-based routes take precedence, then mount API routes
  
  // First mount Pages router directly at the root for slug-based routing
  logger.info('Mounting pages router at root path for hierarchical routing');
  app.use('/', pagesRouter);
  
  // Then mount API router with versioning
  logger.info(`Mounting API router at /api/${apiVersion}`);
  app.use(`/api/${apiVersion}`, apiRouter);
  
  logger.info('Routers have been reinitialized');
}

// Initial router setup - first create routers
setupRouters();

// Watch for reset marker file changes (for testing)
try {
  // Create empty marker file if it doesn't exist
  if (!fs.existsSync(resetMarkerPath)) {
    fs.writeFileSync(resetMarkerPath, '');
  }
  
  // Watch the marker file for changes
  fs.watch(resetMarkerPath, (eventType) => {
    if (eventType === 'change') {
      logger.info('Reset marker changed, reinitializing server state');
      
      // Get the reset marker content - might indicate which test is running
      const markerContent = fs.readFileSync(resetMarkerPath, 'utf-8');
      logger.info(`Reset requested by: ${markerContent}`);
      
      // Recreate middleware instances
      pagesMiddleware = new PagesMiddleware(logger);
      itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);
      templateRenderer = new TemplateRenderer(templateConfig, logger);
      
      // Reconfigure routers
      setupRouters();
    }
  });
} catch (error) {
  logger.error(`Failed to set up file watcher: ${error.message}`, error);
}

// The routers are now created and mounted in the setupRouters() function

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