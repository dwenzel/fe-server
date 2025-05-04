/**
 * Application entry point
 */
import server from './server.js';
import logger from './services/logger.js';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Graceful shutdown
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// This file serves as the entry point to the application
// The server is already started in server.js
export default server;