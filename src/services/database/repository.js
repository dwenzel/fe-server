/**
 * Database Repository Layer
 *
 * Provides a higher-level interface for accessing data from various entities.
 * Each repository is focused on a specific entity type (pages, items)
 * and abstracts away the details of database operations.
 */

import { getDatabaseConfig, getEntityCollection } from './config.js';
import { createDatabaseAdapter } from './adapter.js';

/**
 * Base Repository class that provides common functionality
 */
export class Repository {
  /**
   * @param {string} entityType - The type of entity this repository manages
   * @param {Object} adapter - The database adapter instance
   */
  constructor(entityType, adapter) {
    this.entityType = entityType;
    this.adapter = adapter;
    this.collection = getEntityCollection(adapter.config.type, entityType);
  }

  /**
   * Create a new entity
   * @param {Object} data - The entity data
   * @returns {Promise<string>} The ID of the created entity
   */
  async create(data) {
    return this.adapter.create(this.collection, data);
  }

  /**
   * Get an entity by ID
   * @param {string} id - The entity ID
   * @returns {Promise<Object|null>} The entity or null if not found
   */
  async getById(id) {
    return this.adapter.read(this.collection, id);
  }

  /**
   * Update an entity
   * @param {string} id - The entity ID
   * @param {Object} data - The updated entity data
   * @returns {Promise<boolean>} True if updated, false if not found
   */
  async update(id, data) {
    return this.adapter.update(this.collection, id, data);
  }

  /**
   * Delete an entity
   * @param {string} id - The entity ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    return this.adapter.delete(this.collection, id);
  }

  /**
   * Get all entities
   * @param {Object} [query] - Query parameters
   * @param {Object} [options] - Query options
   * @returns {Promise<Array>} Array of entities
   */
  async getAll(query = {}, options = {}) {
    return this.adapter.find(this.collection, query, options);
  }

  /**
   * Check if an entity exists
   * @param {string} id - The entity ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(id) {
    return this.adapter.exists(this.collection, id);
  }
}

/**
 * Pages Repository for managing page entities
 */
export class PagesRepository extends Repository {
  constructor(adapter) {
    super('pages', adapter);
  }

  /**
   * Find the root page
   * @returns {Promise<Object|null>} The root page or null if not found
   */
  async findRootPage() {
    const pages = await this.adapter.find(this.collection, { isRoot: true });
    return pages.length > 0 ? pages[0] : null;
  }

  /**
   * Find all child pages for a given parent ID
   * @param {string} parentId - The parent page ID
   * @returns {Promise<Array>} Array of child pages
   */
  async findChildPages(parentId) {
    return this.adapter.find(this.collection, { parent: parentId });
  }

  /**
   * Check if a page has any children
   * @param {string} pageId - The page ID to check
   * @returns {Promise<boolean>} True if the page has children
   */
  async hasChildren(pageId) {
    const children = await this.findChildPages(pageId);
    return children.length > 0;
  }
}

/**
 * Items Repository for managing item entities
 */
export class ItemsRepository extends Repository {
  constructor(adapter) {
    super('items', adapter);
  }
  
  /**
   * Find items by type
   * @param {string} type - The item type
   * @returns {Promise<Array>} Array of items matching the type
   */
  async findByType(type) {
    return this.adapter.find(this.collection, { type });
  }
}

/**
 * Factory function to create repositories with a shared database adapter
 * @param {Object} [config] - Optional database configuration override
 * @returns {Promise<Object>} Object containing repository instances
 */
export async function createRepositories(config = null) {
  const dbConfig = config || getDatabaseConfig();
  const adapter = await createDatabaseAdapter(dbConfig.type, dbConfig);
  
  // Connect to the database
  await adapter.connect();
  
  return {
    pages: new PagesRepository(adapter),
    items: new ItemsRepository(adapter),
    adapter,  // Expose adapter for explicit control if needed
  };
}