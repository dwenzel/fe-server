/**
 * Application configuration
 */

export default {
  // Server configuration
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
  },
  
  // API configuration
  api: {
    key: process.env.API_KEY || 'test-api-key',
    version: 'v1',
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  // Item types enum
  itemTypes: ['dynamic', 'list', 'news', 'project', 'event'],
  
  // Status values
  statusValues: ['Option1', 'Option2'],
};