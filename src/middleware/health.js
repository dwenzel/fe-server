/**
 * Health check middleware for the API
 * Used to verify API availability for clients and testing
 */

/**
 * Creates a health check middleware for the API
 * @param {Object} options - Health check options
 * @param {Object} options.logger - Logger instance
 * @returns {Object} Express router with health check endpoint
 */
export const createHealthMiddleware = ({ logger }) => {
  const express = import('express');
  const router = express.Router();

  /**
   * GET /health
   * Health check endpoint for monitoring and testing
   */
  router.get('/', (req, res) => {
    logger.info('Health check requested');

    // Basic health check - return OK status
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  return router;
};

export default { createHealthMiddleware };
