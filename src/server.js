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
import PagesMiddleware from './middleware/pages.js';
import ItemsMiddleware from './middleware/items.js';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API version endpoint
app.get('/version', (req, res) => {
  res.status(200).json({
    version: config.api.version,
    server: 'Frontend Server API'
  });
});

// Create API middleware instances
const pagesMiddleware = new PagesMiddleware(logger);
const itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);

// Mount API routes with versioning and backend prefix
app.use('/backend/pages', pagesMiddleware.getRouter());
app.use('/backend/items', itemsMiddleware.getRouter());

// Public frontend routes for pages
app.get('/frontend/pages', (req, res) => {
  const pagesArray = Array.from(pagesMiddleware.getDataStore().values());
  res.status(200).json(pagesArray);
});

app.get('/frontend/pages/:id', (req, res) => {
  const id = req.params.id;
  
  if (!pagesMiddleware.hasPage(id)) {
    logger.warn(`Page not found with ID: ${id}`);
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const page = pagesMiddleware.getDataStore().get(id);
  res.status(200).json(page);
});

// Public frontend routes for items
app.get('/frontend/items', (req, res) => {
  const itemsArray = Array.from(itemsMiddleware.getDataStore().values());
  res.status(200).json(itemsArray);
});

app.get('/frontend/items/:id', (req, res) => {
  const id = req.params.id;
  
  const item = itemsMiddleware.getDataStore().get(id);
  if (!item) {
    logger.warn(`Item not found with ID: ${id}`);
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.status(200).json(item);
});

// Error handling middleware
app.use((err, req, res) => {
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
