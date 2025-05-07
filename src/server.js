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
import { createApiRouter, createPagesRouter } from './routers/index.js';

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

// Create API middleware instances
const pagesMiddleware = new PagesMiddleware(logger);
const itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);

// Create template renderer
const templateRenderer = new TemplateRenderer(templateConfig, logger);
templateRenderer.ensureTemplateDirs();

// Create our routers
const apiRouter = createApiRouter(pagesMiddleware, itemsMiddleware);
const pagesRouter = createPagesRouter(pagesMiddleware, itemsMiddleware, templateRenderer);

// Mount API router with versioning
app.use(`/api/${apiVersion}`, apiRouter);

// Mount Pages router directly at the root for slug-based routing
app.use('/', pagesRouter);

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