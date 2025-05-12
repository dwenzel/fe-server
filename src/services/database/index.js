/**
 * Database Service Entry Point
 * 
 * This module exports all database-related components for easy access
 * throughout the application.
 */

// Export database adapter interface and implementations
export { DatabaseAdapter, createDatabaseAdapter } from './adapter.js';
export { InMemoryAdapter } from './memory-adapter.js';
export { MongoDBAdapter } from './mongodb-adapter.js';

// Export database configuration
export { default as dbConfig, getDatabaseConfig, getEntityCollection } from './config.js';

// Export repositories
export { Repository, PagesRepository, ItemsRepository, createRepositories } from './repository.js';

// Export utility functions
export async function initializeDatabase() {
  const { createRepositories } = await import('./repository.js');
  return createRepositories();
}