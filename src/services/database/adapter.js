/**
 * Database Adapter Interface
 * 
 * This module defines the interface that all database adapters must implement.
 * It provides a consistent API for database operations regardless of the 
 * underlying database technology.
 */

/**
 * Base Database Adapter class that defines the interface
 * All database adapters should extend this class and implement its methods
 */
export class DatabaseAdapter {
  /**
   * Initialize the database connection
   * @returns {Promise<void>} Resolves when connection is established
   */
  async connect() {
    throw new Error('Method not implemented: connect()');
  }
  
  /**
   * Close the database connection
   * @returns {Promise<void>} Resolves when connection is closed
   */
  async disconnect() {
    throw new Error('Method not implemented: disconnect()');
  }
  
  /**
   * Create a new record in the specified collection
   * @param {string} collection - The collection/table name
   * @param {Object} data - The data to insert
   * @returns {Promise<string>} Resolves with the ID of the created record
   */
  async create(collection, data) {
    throw new Error('Method not implemented: create()');
  }
  
  /**
   * Read a record by ID from the specified collection
   * @param {string} collection - The collection/table name
   * @param {string} id - The record ID
   * @returns {Promise<Object|null>} Resolves with the record or null if not found
   */
  async read(collection, id) {
    throw new Error('Method not implemented: read()');
  }
  
  /**
   * Update a record in the specified collection
   * @param {string} collection - The collection/table name
   * @param {string} id - The record ID
   * @param {Object} data - The data to update
   * @returns {Promise<boolean>} Resolves with true if updated, false if not found
   */
  async update(collection, id, data) {
    throw new Error('Method not implemented: update()');
  }
  
  /**
   * Delete a record from the specified collection
   * @param {string} collection - The collection/table name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} Resolves with true if deleted, false if not found
   */
  async delete(collection, id) {
    throw new Error('Method not implemented: delete()');
  }
  
  /**
   * Find records in the specified collection that match the query
   * @param {string} collection - The collection/table name
   * @param {Object} query - The query criteria
   * @param {Object} [options] - Query options (sorting, pagination, etc)
   * @returns {Promise<Array>} Resolves with an array of matching records
   */
  async find(collection, query, options = {}) {
    throw new Error('Method not implemented: find()');
  }
  
  /**
   * Check if a record exists in the specified collection
   * @param {string} collection - The collection/table name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} Resolves with true if exists, false otherwise
   */
  async exists(collection, id) {
    throw new Error('Method not implemented: exists()');
  }
  
  /**
   * Begin a transaction
   * @returns {Promise<Object>} Resolves with a transaction object
   */
  async beginTransaction() {
    throw new Error('Method not implemented: beginTransaction()');
  }
  
  /**
   * Commit a transaction
   * @param {Object} transaction - The transaction to commit
   * @returns {Promise<void>} Resolves when transaction is committed
   */
  async commitTransaction(transaction) {
    throw new Error('Method not implemented: commitTransaction()');
  }
  
  /**
   * Rollback a transaction
   * @param {Object} transaction - The transaction to rollback
   * @returns {Promise<void>} Resolves when transaction is rolled back
   */
  async rollbackTransaction(transaction) {
    throw new Error('Method not implemented: rollbackTransaction()');
  }
}

/**
 * Factory function to create a database adapter instance
 * @param {string} type - The type of database adapter to create
 * @param {Object} config - Configuration options for the adapter
 * @returns {Promise<DatabaseAdapter>} Resolves with the adapter instance
 */
export async function createDatabaseAdapter(type, config) {
  switch (type.toLowerCase()) {
    case 'mongodb':
      const { MongoDBAdapter } = await import('./mongodb-adapter.js');
      return new MongoDBAdapter(config);
    case 'postgres':
    case 'postgresql':
      const { PostgresAdapter } = await import('./postgres-adapter.js');
      return new PostgresAdapter(config);
    case 'mysql':
      const { MySQLAdapter } = await import('./mysql-adapter.js');
      return new MySQLAdapter(config);
    case 'memory':
    case 'in-memory':
      const { InMemoryAdapter } = await import('./memory-adapter.js');
      return new InMemoryAdapter(config);
    default:
      throw new Error(`Unsupported database adapter type: ${type}`);
  }
}