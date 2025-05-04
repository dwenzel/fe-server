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
    server: 'Pages & Items API'
  });
});

// Create API middleware instances
const pagesMiddleware = new PagesMiddleware(logger);
const itemsMiddleware = new ItemsMiddleware(logger, pagesMiddleware);

// Mount API routes with versioning
app.use('/pages', pagesMiddleware.getRouter());
app.use('/items', itemsMiddleware.getRouter());

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