/**
 * In-Memory Database Adapter
 *
 * This adapter implements the DatabaseAdapter interface using in-memory storage.
 * It's primarily useful for testing and development.
 */

import { DatabaseAdapter } from './adapter.js';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryAdapter extends DatabaseAdapter {
  constructor(config = {}) {
    super();
    this.data = new Map(); // Collection name -> Map of id -> document
    this.connected = false;
    this.config = config;
  }

  /**
   * Initialize the in-memory database
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected) return;

    try {
      // Initialize collections
      this.data.set('pages', new Map());
      this.data.set('items', new Map());

      // Load initial data if provided in config
      if (this.config.initialData) {
        for (const [collection, items] of Object.entries(this.config.initialData)) {
          if (!this.data.has(collection)) {
            this.data.set(collection, new Map());
          }

          const collectionMap = this.data.get(collection);
          for (const item of items) {
            if (!item.id) {
              item.id = uuidv4();
            }
            collectionMap.set(item.id, item);
          }
        }
      }

      this.connected = true;

    } catch (error) {
      console.error('Error connecting to in-memory database:', error);
      throw error;
    }
  }

  /**
   * Close the database connection (no-op for in-memory adapter)
   * @returns {Promise<void>}
   */
  async disconnect() {
    this.connected = false;
  }

  /**
   * Create a new record in the specified collection
   * @param {string} collection - The collection name
   * @param {Object} data - The data to insert
   * @returns {Promise<string>} The ID of the created record
   */
  async create(collection, data) {
    this._ensureConnected();
    this._ensureCollectionExists(collection);

    // Ensure data has an ID
    if (!data.id) {
      data.id = uuidv4();
    }

    const collectionMap = this.data.get(collection);
    collectionMap.set(data.id, structuredClone(data));

    return data.id;
  }

  /**
   * Read a record by ID from the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The record ID
   * @returns {Promise<Object|null>} The record or null if not found
   */
  async read(collection, id) {
    this._ensureConnected();
    if (!this.data.has(collection)) return null;

    const collectionMap = this.data.get(collection);
    const data = collectionMap.get(id);

    return data ? structuredClone(data) : null;
  }

  /**
   * Update a record in the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The record ID
   * @param {Object} data - The data to update
   * @returns {Promise<boolean>} True if updated, false if not found
   */
  async update(collection, id, data) {
    this._ensureConnected();
    if (!this.data.has(collection)) return false;

    const collectionMap = this.data.get(collection);
    if (!collectionMap.has(id)) return false;

    // Ensure ID is preserved
    data.id = id;

    collectionMap.set(id, structuredClone(data));
    return true;
  }

  /**
   * Delete a record from the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(collection, id) {
    this._ensureConnected();
    if (!this.data.has(collection)) return false;

    const collectionMap = this.data.get(collection);
    if (!collectionMap.has(id)) return false;

    return collectionMap.delete(id);
  }

  /**
   * Find records in the specified collection that match the query
   * @param {string} collection - The collection name
   * @param {Object} query - The query criteria
   * @param {Object} options - Query options (sorting, pagination, etc)
   * @returns {Promise<Array>} Array of matching records
   */
  async find(collection, query = {}, options = {}) {
    this._ensureConnected();
    if (!this.data.has(collection)) return [];

    const collectionMap = this.data.get(collection);
    let results = Array.from(collectionMap.values());

    // Apply filters based on query
    results = this._filterByQuery(results, query);

    // Apply sorting
    if (options.sort) {
      const { field, order } = options.sort;
      results.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    if (options.limit) {
      const skip = options.skip || 0;
      results = results.slice(skip, skip + options.limit);
    }

    return results.map(item => structuredClone(item));
  }

  /**
   * Check if a record exists in the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(collection, id) {
    this._ensureConnected();
    if (!this.data.has(collection)) return false;

    const collectionMap = this.data.get(collection);
    return collectionMap.has(id);
  }

  /**
   * Begin a transaction (basic implementation for interface compatibility)
   * @returns {Promise<Object>} A transaction object
   */
  async beginTransaction() {
    this._ensureConnected();

    // Create snapshots of all collections
    const snapshot = new Map();
    for (const [collectionName, collection] of this.data.entries()) {
      snapshot.set(collectionName, new Map(collection));
    }

    return { snapshot };
  }

  /**
   * Commit a transaction (no-op for in-memory adapter)
   * @param {Object} transaction - The transaction to commit
   * @returns {Promise<void>}
   */
  async commitTransaction(transaction) {
    this._ensureConnected();
    // Nothing to do for in-memory implementation
  }

  /**
   * Rollback a transaction
   * @param {Object} transaction - The transaction to rollback
   * @returns {Promise<void>}
   */
  async rollbackTransaction(transaction) {
    this._ensureConnected();

    if (transaction && transaction.snapshot) {
      this.data = transaction.snapshot;
    }
  }

  /**
   * Clear all data (useful for testing)
   * @returns {Promise<void>}
   */
  async clear() {
    for (const collection of this.data.values()) {
      collection.clear();
    }
  }

  /**
   * Ensure the adapter is connected
   * @private
   */
  _ensureConnected() {
    if (!this.connected) {
      throw new Error('Database adapter is not connected');
    }
  }

  /**
   * Ensure the collection exists
   * @param {string} collection - The collection name
   * @private
   */
  _ensureCollectionExists(collection) {
    if (!this.data.has(collection)) {
      this.data.set(collection, new Map());
    }
  }

  /**
   * Filter results by query criteria
   * @param {Array} items - The items to filter
   * @param {Object} query - The query criteria
   * @returns {Array} Filtered items
   * @private
   */
  _filterByQuery(items, query) {
    if (!query || Object.keys(query).length === 0) {
      return items;
    }

    return items.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        // Handle nested properties with dot notation
        if (key.includes('.')) {
          const parts = key.split('.');
          let obj = item;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!obj || typeof obj !== 'object') return false;
            obj = obj[parts[i]];
          }
          const lastPart = parts[parts.length - 1];
          return obj && obj[lastPart] === value;
        }

        // Handle special operators
        if (typeof value === 'object' && value !== null) {
          if ('$eq' in value) return item[key] === value.$eq;
          if ('$ne' in value) return item[key] !== value.$ne;
          if ('$gt' in value) return item[key] > value.$gt;
          if ('$gte' in value) return item[key] >= value.$gte;
          if ('$lt' in value) return item[key] < value.$lt;
          if ('$lte' in value) return item[key] <= value.$lte;
          if ('$in' in value) return Array.isArray(value.$in) && value.$in.includes(item[key]);
          if ('$nin' in value) return Array.isArray(value.$nin) && !value.$nin.includes(item[key]);
          if ('$exists' in value) return (key in item) === value.$exists;
        }

        // Simple equality check
        return item[key] === value;
      });
    });
  }
}
