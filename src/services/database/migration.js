/**
 * Database Migration Utilities
 * 
 * This module provides utilities for migrating data between different
 * database backends and schema versions.
 */

import { createDatabaseAdapter } from './adapter.js';
import { getDatabaseConfig } from './config.js';

/**
 * Migrate data from one database to another
 * @param {string} sourceType - Source database type
 * @param {Object} sourceConfig - Source database configuration
 * @param {string} targetType - Target database type
 * @param {Object} targetConfig - Target database configuration
 * @param {Array<string>} collections - Collections to migrate
 * @returns {Promise<Object>} Migration results with counts
 */
export async function migrateDatabase(
  sourceType,
  sourceConfig,
  targetType,
  targetConfig,
  collections = ['pages', 'items']
) {
  // Create source and target adapters
  const sourceAdapter = await createDatabaseAdapter(sourceType, sourceConfig);
  const targetAdapter = await createDatabaseAdapter(targetType, targetConfig);
  
  // Connect to both databases
  await sourceAdapter.connect();
  await targetAdapter.connect();
  
  try {
    const results = {};
    
    // Migrate each collection
    for (const collection of collections) {
      const data = await sourceAdapter.find(collection);
      results[collection] = { 
        total: data.length,
        migrated: 0,
        failed: 0,
        failures: []
      };
      
      // Insert each document into the target database
      for (const document of data) {
        try {
          await targetAdapter.create(collection, document);
          results[collection].migrated++;
        } catch (error) {
          results[collection].failed++;
          results[collection].failures.push({
            id: document.id,
            error: error.message
          });
        }
      }
    }
    
    return results;
  } finally {
    // Ensure connections are closed
    await sourceAdapter.disconnect();
    await targetAdapter.disconnect();
  }
}

/**
 * Export data from a database to JSON
 * @param {string} type - Source database type
 * @param {Object} config - Source database configuration
 * @param {Array<string>} collections - Collections to export
 * @returns {Promise<Object>} Exported data by collection
 */
export async function exportDatabase(
  type = null,
  config = null,
  collections = ['pages', 'items']
) {
  // Get configuration or use provided values
  const dbConfig = config || getDatabaseConfig(type);
  const adapter = await createDatabaseAdapter(dbConfig.type, dbConfig);
  
  // Connect to the database
  await adapter.connect();
  
  try {
    const exportData = {};
    
    // Export each collection
    for (const collection of collections) {
      exportData[collection] = await adapter.find(collection);
    }
    
    return exportData;
  } finally {
    await adapter.disconnect();
  }
}

/**
 * Import data from JSON to a database
 * @param {Object} data - Data to import by collection
 * @param {string} type - Target database type
 * @param {Object} config - Target database configuration
 * @param {boolean} clear - Whether to clear existing data before import
 * @returns {Promise<Object>} Import results with counts
 */
export async function importDatabase(
  data,
  type = null,
  config = null,
  clear = false
) {
  // Get configuration or use provided values
  const dbConfig = config || getDatabaseConfig(type);
  const adapter = await createDatabaseAdapter(dbConfig.type, dbConfig);
  
  // Connect to the database
  await adapter.connect();
  
  try {
    const results = {};
    
    // Process each collection in the data
    for (const [collection, documents] of Object.entries(data)) {
      results[collection] = { 
        total: documents.length,
        imported: 0,
        failed: 0,
        failures: []
      };
      
      // Clear existing data if requested
      if (clear && adapter.clear) {
        // Only InMemoryAdapter supports clear() directly
        await adapter.clear();
      } else if (clear) {
        // For other adapters, manually delete all documents
        const existingDocs = await adapter.find(collection);
        for (const doc of existingDocs) {
          await adapter.delete(collection, doc.id);
        }
      }
      
      // Insert each document
      for (const document of documents) {
        try {
          await adapter.create(collection, document);
          results[collection].imported++;
        } catch (error) {
          results[collection].failed++;
          results[collection].failures.push({
            id: document.id,
            error: error.message
          });
        }
      }
    }
    
    return results;
  } finally {
    await adapter.disconnect();
  }
}