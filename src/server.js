/**
 * Main Express server setup with database support
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './services/logger.js';
import dbConfig from './services/database/config.js';
import templateConfig from './config/templates.js';
import { createRepositories } from './services/database/repository.js';
import PagesMiddleware from './middleware/pages.js';
import ItemsMiddleware from './middleware/items.js';
import TemplateRenderer from './services/templates/template-renderer.js';
import { createApiRouter, createPagesRouter } from './routers/index.js';

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const resetMarkerPath = path.join(dataDir, 'reset-server.marker');

// Create a data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create Express app
const app = express();
const PORT = dbConfig.server.port;
const HOST = dbConfig.server.host;

// Apply global middleware
app.use(cors());
app.use(bodyParser.json());

// Get API version from config
const apiVersion = dbConfig.api.version;

// Database repositories and middleware instances
let repositories;
let pagesMiddleware;
let itemsMiddleware;
let templateRenderer;

// Function to initialize the database and create middleware instances
async function initializeServices() {
  try {
    // Initialize database and create repositories
    repositories = await createRepositories();

    // Create API middleware instances
    pagesMiddleware = new PagesMiddleware(logger, repositories.pages);
    itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware, repositories.items);

    // Create template renderer
    templateRenderer = new TemplateRenderer(templateConfig, logger);
    templateRenderer.ensureTemplateDirs();

    logger.info(`Database initialized with ${dbConfig.db.type} adapter`);
  } catch (error) {
    logger.error(`Failed to initialize database: ${error.message}`, error);
    throw error;
  }
}

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
    logger.info('Cleaning up existing router stack before reconfiguration');
    app._router.stack = app._router.stack.filter(layer => {
      return layer.name !== 'router' ||
             (layer.regexp && !layer.regexp.test(`/api/${apiVersion}`) &&
              layer.regexp && !layer.regexp.test('/'));
    });
  }

  // Reset middlewares to re-mount routers
  app._router = undefined;

  // IMPORTANT: Order matters for routing.
  // First, mount API router at /api/v1 to handle all API routes
  logger.info(`Mounting API router at /api/${apiVersion}`);
  app.use(`/api/${apiVersion}`, apiRouter);

  // Then mount Pages router at root for hierarchical routing
  logger.info('Mounting pages router at root path for hierarchical routing');
  app.use('/', pagesRouter);

  logger.info('Routers have been reinitialized');
}

// Watch for reset marker file changes (for testing)
async function setupResetWatcher() {
  try {
    // Create an empty marker file if it doesn't exist
    if (!fs.existsSync(resetMarkerPath)) {
      fs.writeFileSync(resetMarkerPath, '');
    }

    // Watch the marker file for changes
    fs.watch(resetMarkerPath, async (eventType) => {
      if (eventType === 'change') {
        logger.info('Reset marker changed, reinitializing server state');

        // Get the reset marker content - might indicate which test is running
        const markerContent = fs.readFileSync(resetMarkerPath, 'utf-8');
        logger.info(`Reset requested by: ${markerContent}`);

        // Close existing database connection if any
        if (repositories && repositories.adapter) {
          await repositories.adapter.disconnect();
        }

        // Reinitialize services and reconfigure routers
        await initializeServices();
        setupRouters();
      }
    });
  } catch (error) {
    logger.error(`Failed to set up file watcher: ${error.message}`, error);
  }
}

// Initialize the server
async function startServer() {
  try {
    // Initialize database and services
    await initializeServices();

    // Initial router setup
    setupRouters();

    // Set up reset marker watcher for testing
    //await setupResetWatcher();

    // Error handling middleware
    app.use((err, req, res, next) => {
      logger.error(`Unhandled error: ${err.stack}`);
      res.status(500).json({ error: 'Internal server error' });
      next(err);
    });

    // Start server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running on ${HOST}:${PORT} with ${dbConfig.db.type} database`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');

      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connection
        if (repositories && repositories.adapter) {
          try {
            await repositories.adapter.disconnect();
            logger.info('Database connection closed');
          } catch (error) {
            logger.error(`Error closing database connection: ${error.message}`);
          }
        }
      });
    });

    return server;
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, error);
    process.exit(1);
  }
}

// Start the server and export it
const server = await startServer();
export default server;
