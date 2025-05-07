/**
 * API Router for backend endpoints
 */
import { Router } from 'express';
import logger from '../services/logger.js';
import config from '../config.js';

/**
 * Creates and configures the API router
 * @param {Object} pagesMiddleware - Pages middleware instance
 * @param {Object} itemsMiddleware - Items middleware instance
 * @returns {Router} Configured Express router
 */
export function createApiRouter(pagesMiddleware, itemsMiddleware) {
  const apiRouter = Router();
  const apiVersion = config.api.version;
  
  // Health check endpoint
  apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });
  
  // API version endpoint
  apiRouter.get('/version', (req, res) => {
    res.status(200).json({
      version: apiVersion,
      server: 'Frontend Server API'
    });
  });
  
  // Mount backend routes for CRUD operations
  apiRouter.use('/backend/pages', pagesMiddleware.getRouter());
  apiRouter.use('/backend/items', itemsMiddleware.getRouter());
  
  // Error handling middleware
  apiRouter.use((err, req, res, next) => {
    logger.error(`API error: ${err.stack}`);
    res.status(500).json({ error: 'Internal server error' });
  });
  
  return apiRouter;
}