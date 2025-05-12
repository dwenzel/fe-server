/**
 * PostgreSQL Database Adapter
 * 
 * This adapter implements the DatabaseAdapter interface using PostgreSQL.
 */

import { DatabaseAdapter } from './adapter.js';
import pg from 'pg';

export class PostgresAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.pool = null;
    this.connected = false;
    
    // Table schemas for the entities
    this.schemas = {
      pages: {
        create: `
          CREATE TABLE IF NOT EXISTS pages (
            id UUID PRIMARY KEY,
            data JSONB NOT NULL,
            parent UUID,
            is_root BOOLEAN NOT NULL DEFAULT FALSE,
            slug VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS pages_parent_idx ON pages(parent)',
          'CREATE INDEX IF NOT EXISTS pages_is_root_idx ON pages(is_root)',
          'CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug)'
        ]
      },
      items: {
        create: `
          CREATE TABLE IF NOT EXISTS items (
            id UUID PRIMARY KEY,
            data JSONB NOT NULL,
            type VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `,
        indexes: [
          'CREATE INDEX IF NOT EXISTS items_type_idx ON items(type)'
        ]
      }
    };
  }
  
  /**
   * Initialize the PostgreSQL connection
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected) return;
    
    try {
      this.pool = new pg.Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false
      });
      
      // Test the connection
      await this.pool.query('SELECT NOW()');
      
      // Initialize schema if needed
      await this._initializeSchema();
      
      this.connected = true;
    } catch (error) {
      throw new Error(`Failed to connect to PostgreSQL: ${error.message}`);
    }
  }
  
  /**
   * Close the PostgreSQL connection
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.connected) return;
    
    try {
      await this.pool.end();
      this.connected = false;
    } catch (error) {
      throw new Error(`Failed to disconnect from PostgreSQL: ${error.message}`);
    }
  }
  
  /**
   * Create tables and indexes if they don't exist
   * @private
   */
  async _initializeSchema() {
    for (const [tableName, schema] of Object.entries(this.schemas)) {
      // Create the table
      await this.pool.query(schema.create);
      
      // Create the indexes
      for (const indexQuery of schema.indexes) {
        await this.pool.query(indexQuery);
      }
    }
  }
  
  /**
   * Create a new record in the specified collection
   * @param {string} collection - The table name
   * @param {Object} data - The data to insert
   * @returns {Promise<string>} The ID of the created record
   */
  async create(collection, data) {
    this._ensureConnected();
    
    // Extract fields from data for specific columns
    const { id, parent, isRoot, slug } = data;
    
    try {
      if (collection === 'pages') {
        await this.pool.query(
          'INSERT INTO pages (id, data, parent, is_root, slug) VALUES ($1, $2, $3, $4, $5)',
          [id, data, parent || null, isRoot || false, slug || null]
        );
      } else if (collection === 'items') {
        await this.pool.query(
          'INSERT INTO items (id, data, type) VALUES ($1, $2, $3)',
          [id, data, data.type || null]
        );
      } else {
        throw new Error(`Unsupported collection: ${collection}`);
      }
      
      return id;
    } catch (error) {
      throw new Error(`Failed to create record in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Read a record by ID from the specified collection
   * @param {string} collection - The table name
   * @param {string} id - The record ID
   * @returns {Promise<Object|null>} The record or null if not found
   */
  async read(collection, id) {
    this._ensureConnected();
    
    try {
      const result = await this.pool.query(
        `SELECT data FROM ${collection} WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0].data;
    } catch (error) {
      throw new Error(`Failed to read record from ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Update a record in the specified collection
   * @param {string} collection - The table name
   * @param {string} id - The record ID
   * @param {Object} data - The data to update
   * @returns {Promise<boolean>} True if updated, false if not found
   */
  async update(collection, id, data) {
    this._ensureConnected();
    
    // Extract fields from data for specific columns
    const { parent, isRoot, slug } = data;
    
    try {
      let result;
      
      if (collection === 'pages') {
        result = await this.pool.query(
          `UPDATE pages 
           SET data = $1, parent = $2, is_root = $3, slug = $4, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $5`,
          [data, parent || null, isRoot || false, slug || null, id]
        );
      } else if (collection === 'items') {
        result = await this.pool.query(
          `UPDATE items 
           SET data = $1, type = $2, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $3`,
          [data, data.type || null, id]
        );
      } else {
        throw new Error(`Unsupported collection: ${collection}`);
      }
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to update record in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Delete a record from the specified collection
   * @param {string} collection - The table name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(collection, id) {
    this._ensureConnected();
    
    try {
      const result = await this.pool.query(
        `DELETE FROM ${collection} WHERE id = $1`,
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete record from ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Find records in the specified collection that match the query
   * @param {string} collection - The table name
   * @param {Object} query - The query criteria
   * @param {Object} options - Query options (sorting, pagination, etc)
   * @returns {Promise<Array>} Array of matching records
   */
  async find(collection, query = {}, options = {}) {
    this._ensureConnected();
    
    try {
      // Start building the query
      let sqlQuery = `SELECT data FROM ${collection}`;
      const params = [];
      let paramIndex = 1;
      
      // Build the WHERE clause based on the query
      const whereConditions = [];
      
      if (Object.keys(query).length > 0) {
        for (const [key, value] of Object.entries(query)) {
          // Handle special fields that are stored as columns
          if (collection === 'pages') {
            if (key === 'isRoot') {
              whereConditions.push(`is_root = $${paramIndex++}`);
              params.push(value);
              continue;
            }
            if (key === 'parent') {
              whereConditions.push(`parent = $${paramIndex++}`);
              params.push(value);
              continue;
            }
            if (key === 'slug') {
              whereConditions.push(`slug = $${paramIndex++}`);
              params.push(value);
              continue;
            }
          }
          
          if (collection === 'items' && key === 'type') {
            whereConditions.push(`type = $${paramIndex++}`);
            params.push(value);
            continue;
          }
          
          // For other fields, use JSONB operators
          if (typeof value === 'object' && value !== null) {
            // Handle operators like $eq, $ne, etc.
            for (const [op, val] of Object.entries(value)) {
              switch (op) {
                case '$eq':
                  whereConditions.push(`data->>'${key}' = $${paramIndex++}`);
                  params.push(val);
                  break;
                case '$ne':
                  whereConditions.push(`data->>'${key}' != $${paramIndex++}`);
                  params.push(val);
                  break;
                case '$in':
                  whereConditions.push(`data->>'${key}' IN (${val.map(() => `$${paramIndex++}`).join(', ')})`);
                  params.push(...val);
                  break;
                // Add more operators as needed
              }
            }
          } else {
            // Simple equality
            whereConditions.push(`data->>'${key}' = $${paramIndex++}`);
            params.push(value);
          }
        }
      }
      
      if (whereConditions.length > 0) {
        sqlQuery += ` WHERE ${whereConditions.join(' AND ')}`;
      }
      
      // Add sorting
      if (options.sort) {
        const { field, order } = options.sort;
        sqlQuery += ` ORDER BY data->>'${field}' ${order === 'asc' ? 'ASC' : 'DESC'}`;
      }
      
      // Add pagination
      if (options.limit) {
        sqlQuery += ` LIMIT $${paramIndex++}`;
        params.push(options.limit);
        
        if (options.skip) {
          sqlQuery += ` OFFSET $${paramIndex++}`;
          params.push(options.skip);
        }
      }
      
      const result = await this.pool.query(sqlQuery, params);
      return result.rows.map(row => row.data);
    } catch (error) {
      throw new Error(`Failed to find records in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Check if a record exists in the specified collection
   * @param {string} collection - The table name
   * @param {string} id - The record ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(collection, id) {
    this._ensureConnected();
    
    try {
      const result = await this.pool.query(
        `SELECT EXISTS(SELECT 1 FROM ${collection} WHERE id = $1)`,
        [id]
      );
      
      return result.rows[0].exists;
    } catch (error) {
      throw new Error(`Failed to check record existence in ${collection}: ${error.message}`);
    }
  }
  
  /**
   * Begin a transaction
   * @returns {Promise<Object>} A transaction object
   */
  async beginTransaction() {
    this._ensureConnected();
    
    try {
      const client = await this.pool.connect();
      await client.query('BEGIN');
      return { client };
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
    
    if (!transaction || !transaction.client) {
      throw new Error('Invalid transaction object');
    }
    
    const { client } = transaction;
    
    try {
      await client.query('COMMIT');
    } catch (error) {
      throw new Error(`Failed to commit transaction: ${error.message}`);
    } finally {
      client.release();
    }
  }
  
  /**
   * Rollback a transaction
   * @param {Object} transaction - The transaction to rollback
   * @returns {Promise<void>}
   */
  async rollbackTransaction(transaction) {
    this._ensureConnected();
    
    if (!transaction || !transaction.client) {
      throw new Error('Invalid transaction object');
    }
    
    const { client } = transaction;
    
    try {
      await client.query('ROLLBACK');
    } catch (error) {
      throw new Error(`Failed to rollback transaction: ${error.message}`);
    } finally {
      client.release();
    }
  }
  
  /**
   * Ensure the adapter is connected
   * @private
   */
  _ensureConnected() {
    if (!this.connected) {
      throw new Error('PostgreSQL adapter is not connected');
    }
  }
}