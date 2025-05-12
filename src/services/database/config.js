/**
 * Database Configuration
 * 
 * This module provides configuration settings for various database adapters.
 * It extends the application's main configuration with database-specific settings.
 */

import appConfig from '../../config.js';

// Default database config with fallbacks to environment variables
const dbConfig = {
  // The type of database adapter to use ('mongodb', 'postgresql', 'mysql', 'memory')
  type: process.env.DB_TYPE || 'memory',
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/frontend-server',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    // Collection names
    collections: {
      pages: 'pages',
      items: 'items',
    },
  },
  
  // PostgreSQL configuration
  postgresql: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'frontend_server',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    ssl: process.env.POSTGRES_SSL === 'true',
    // Table names
    tables: {
      pages: 'pages',
      items: 'items',
    },
  },
  
  // MySQL configuration
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    database: process.env.MYSQL_DB || 'frontend_server',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    // Table names
    tables: {
      pages: 'pages',
      items: 'items',
    },
  },
  
  // In-memory adapter configuration
  memory: {
    // Optional initial data can be provided here or via environment
    initialData: {},
  },
};

// Add database configuration to the application config
export default {
  ...appConfig,
  db: dbConfig,
};

/**
 * Get configuration for a specific database type
 * @param {string} type - The database type
 * @returns {Object} Database-specific configuration
 */
export function getDatabaseConfig(type = null) {
  // Use provided type or fall back to configured type
  const dbType = type || dbConfig.type;
  
  // Return the configuration for the specific database type
  return {
    type: dbType,
    ...dbConfig[dbType],
  };
}

/**
 * Get the collection or table name for an entity
 * @param {string} type - The database type
 * @param {string} entity - The entity name ('pages' or 'items')
 * @returns {string} The collection or table name
 */
export function getEntityCollection(type, entity) {
  const config = getDatabaseConfig(type);
  
  // Different database types use different property names
  const collectionMap = {
    'mongodb': config.collections || {},
    'postgresql': config.tables || {},
    'mysql': config.tables || {},
    'memory': { pages: 'pages', items: 'items' },
  };
  
  return collectionMap[type]?.[entity] || entity;
}