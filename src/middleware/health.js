/**
 * Health check middleware for the API
 * Used to verify API availability for clients and testing
 */
import { Router } from 'express';

class HealthMiddleware {
  constructor(logger) {
    this.router = Router();
    this.logger = logger;
    this.setupRoutes();
  }

  /**
   * Setup health check routes
   */
  setupRoutes() {
    // Simple health check that always returns 200 OK
    this.router.get('/', this.healthCheck.bind(this));
  }

  /**
   * Basic health check handler
   */
  healthCheck(req, res) {
    this.logger.info('Health check requested');
    
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get the router middleware
   */
  getRouter() {
    return this.router;
  }
}

export default HealthMiddleware;