import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'pages-items-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY || 'test-api-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-Api-Key');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  
  next();
};

// In-memory data stores
const pages = new Map();
const items = new Map();

// UUID validation helper
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Item type enum validation
const validItemTypes = ['dynamic', 'list', 'news', 'project', 'event'];

// Validation middleware for Pages
const validatePage = (req, res, next) => {
  const page = req.body;

  // Check required fields
  if (!page.id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  // Validate UUID format
  if (!isValidUUID(page.id)) {
    return res.status(400).json({ error: 'Invalid UUID format for page ID' });
  }

  // Validate parent UUID if provided
  if (page.parent && !isValidUUID(page.parent)) {
    return res.status(400).json({ error: 'Invalid UUID format for parent ID' });
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

// Validation middleware for Items
const validateItem = (req, res, next) => {
  const item = req.body;

  // Check required fields
  if (!item.id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  if (!item.parent) {
    return res.status(400).json({ error: 'Parent ID is required' });
  }

  if (!item.type) {
    return res.status(400).json({ error: 'Item type is required' });
  }

  // Validate UUID format
  if (!isValidUUID(item.id)) {
    return res.status(400).json({ error: 'Invalid UUID format for item ID' });
  }

  if (!isValidUUID(item.parent)) {
    return res.status(400).json({ error: 'Invalid UUID format for parent ID' });
  }

  // Validate item type
  if (!validItemTypes.includes(item.type)) {
    return res.status(400).json({ error: `Invalid item type. Must be one of: ${validItemTypes.join(', ')}` });
  }

  // Validate attributes if provided
  if (item.attributes && item.attributes.status) {
    const validStatuses = ['Option1', 'Option2'];
    if (!validStatuses.includes(item.attributes.status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
  }

  next();
};

// Validate URL ID matches body ID
const validateIdMatch = (req, res, next) => {
  const urlId = req.params.id;
  const bodyId = req.body.id;

  if (urlId !== bodyId) {
    return res.status(400).json({ error: 'URL ID must match body ID' });
  }

  next();
};

// Routes for Pages
app.post('/pages', validateApiKey, validatePage, (req, res) => {
  const page = req.body;
  pages.set(page.id, page);
  
  logger.info(`Created page with ID: ${page.id}`);
  res.status(201).json({ success: true });
});

app.put('/pages/:id', validateApiKey, validatePage, validateIdMatch, (req, res) => {
  const id = req.params.id;
  
  if (!pages.has(id)) {
    logger.warn(`Page not found with ID: ${id}`);
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const page = req.body;
  pages.set(id, page);
  
  logger.info(`Updated page with ID: ${id}`);
  res.status(200).json({ success: true });
});

app.delete('/pages/:id', validateApiKey, (req, res) => {
  const id = req.params.id;
  
  if (!pages.has(id)) {
    logger.warn(`Page not found with ID: ${id}`);
    return res.status(404).json({ error: 'Page not found' });
  }
  
  pages.delete(id);
  
  logger.info(`Deleted page with ID: ${id}`);
  res.status(204).send();
});

// Routes for Items
app.post('/items', validateApiKey, validateItem, (req, res) => {
  const item = req.body;
  items.set(item.id, item);
  
  logger.info(`Created item with ID: ${item.id}`);
  res.status(201).json({ success: true });
});

app.put('/items/:id', validateApiKey, validateItem, validateIdMatch, (req, res) => {
  const id = req.params.id;
  
  if (!items.has(id)) {
    logger.warn(`Item not found with ID: ${id}`);
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const item = req.body;
  items.set(id, item);
  
  logger.info(`Updated item with ID: ${id}`);
  res.status(200).json({ success: true });
});

app.delete('/items/:id', validateApiKey, (req, res) => {
  const id = req.params.id;
  
  if (!items.has(id)) {
    logger.warn(`Item not found with ID: ${id}`);
    return res.status(404).json({ error: 'Item not found' });
  }
  
  items.delete(id);
  
  logger.info(`Deleted item with ID: ${id}`);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

export default server;