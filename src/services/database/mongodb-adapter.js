/**
 * MongoDB Database Adapter
 * 
 * This adapter implements the DatabaseAdapter interface using MongoDB.
 */

import { DatabaseAdapter } from './adapter.js';
import { MongoClient, ObjectId } from 'mongodb';

export class MongoDBAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.client = null;
    this.db = null;
    this.connected = false;
  }
  
  /**
   * Initialize the MongoDB connection
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected) return;
    
    try {
      this.client = new MongoClient(this.config.uri, this.config.options);
      await this.client.connect();
      
      this.db = this.client.db();
      this.connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
  }
  
  /**
   * Close the MongoDB connection
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.connected) return;
    
    try {
      await this.client.close();
      this.connected = false;
    } catch (error) {
      throw new Error(`Failed to disconnect from MongoDB: ${error.message}`);
    }
  }
  
  /**
   * Create a new document in the specified collection
   * @param {string} collection - The collection name
   * @param {Object} data - The data to insert
   * @returns {Promise<string>} The ID of the created document
   */
  async create(collection, data) {
    this._ensureConnected();
    
    // MongoDB will generate _id if not provided, but we use the application's UUID
    const insertData = { ...data };
    
    try {
      const result = await this.db.collection(collection).insertOne(insertData);
      return data.id;
    } catch (error) {
      throw new Error(`Failed to create document in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Read a document by ID from the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The document ID
   * @returns {Promise<Object|null>} The document or null if not found
   */
  async read(collection, id) {
    this._ensureConnected();
    
    try {
      return await this.db.collection(collection).findOne({ id });
    } catch (error) {
      throw new Error(`Failed to read document from ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Update a document in the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The document ID
   * @param {Object} data - The data to update
   * @returns {Promise<boolean>} True if updated, false if not found
   */
  async update(collection, id, data) {
    this._ensureConnected();
    
    try {
      const result = await this.db.collection(collection).replaceOne(
        { id },
        { ...data, id } // Ensure ID is preserved
      );
      
      return result.matchedCount > 0;
    } catch (error) {
      throw new Error(`Failed to update document in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Delete a document from the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The document ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(collection, id) {
    this._ensureConnected();
    
    try {
      const result = await this.db.collection(collection).deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete document from ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Find documents in the specified collection that match the query
   * @param {string} collection - The collection name
   * @param {Object} query - The query criteria
   * @param {Object} options - Query options (sorting, pagination, etc)
   * @returns {Promise<Array>} Array of matching documents
   */
  async find(collection, query = {}, options = {}) {
    this._ensureConnected();
    
    try {
      let cursor = this.db.collection(collection).find(query);
      
      // Apply sorting
      if (options.sort) {
        const { field, order } = options.sort;
        cursor = cursor.sort({ [field]: order === 'asc' ? 1 : -1 });
      }
      
      // Apply pagination
      if (options.skip) {
        cursor = cursor.skip(options.skip);
      }
      
      if (options.limit) {
        cursor = cursor.limit(options.limit);
      }
      
      return await cursor.toArray();
    } catch (error) {
      throw new Error(`Failed to find documents in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Check if a document exists in the specified collection
   * @param {string} collection - The collection name
   * @param {string} id - The document ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(collection, id) {
    this._ensureConnected();
    
    try {
      const count = await this.db.collection(collection).countDocuments({ id }, { limit: 1 });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check document existence in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Begin a transaction
   * @returns {Promise<Object>} A transaction object
   */
  async beginTransaction() {
    this._ensureConnected();
    
    try {
      const session = this.client.startSession();
      session.startTransaction();
      return { session };
    } catch (error) {
      throw new Error(`Failed to begin transaction: ${error.message}`);
    }
  }
  
  /**
   * Commit a transaction
   * @param {Object} transaction - The transaction to commit
   * @returns {Promise<void>}
   */
  async commitTransaction(transaction) {
    this._ensureConnected();
    
    if (!transaction || !transaction.session) {
      throw new Error('Invalid transaction object');
    }
    
    try {
      await transaction.session.commitTransaction();
      await transaction.session.endSession();
    } catch (error) {
      throw new Error(`Failed to commit transaction: ${error.message}`);
    }
  }
  
  /**
   * Rollback a transaction
   * @param {Object} transaction - The transaction to rollback
   * @returns {Promise<void>}
   */
  async rollbackTransaction(transaction) {
    this._ensureConnected();
    
    if (!transaction || !transaction.session) {
      throw new Error('Invalid transaction object');
    }
    
    try {
      await transaction.session.abortTransaction();
      await transaction.session.endSession();
    } catch (error) {
      throw new Error(`Failed to rollback transaction: ${error.message}`);
    }
  }
  
  /**
   * Ensure the adapter is connected
   * @private
   */
  _ensureConnected() {
    if (!this.connected) {
      throw new Error('MongoDB adapter is not connected');
    }
  }
}