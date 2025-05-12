/**
 * Items API Middleware with Database Support
 * 
 * This version of the Items middleware uses the database repository
 * instead of in-memory storage.
 */
import { Router } from 'express';
import { isValidUUID, VALID_ITEM_TYPES, VALID_STATUS_VALUES } from './utils.js';
import { validateApiKey } from './auth.js';
import { validateIdMatch } from './validation.js';

class ItemsMiddleware {
  /**
   * @param {Object} logger - Winston logger instance
   * @param {Object} pagesMiddleware - Pages middleware instance
   * @param {Object} itemsRepository - Items repository instance
   */
  constructor(logger, pagesMiddleware, itemsRepository) {
    this.router = Router();
    this.logger = logger;
    this.repository = itemsRepository;
    this.pagesMiddleware = pagesMiddleware; // Reference to pages middleware for parent validation
    this.setupRoutes();
  }

  /**
   * Validation middleware for Items
   */
  validateItem = (req, res, next) => {
    const item = req.body;

    // Check required fields
    if (!item.id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    if (!item.parent) {
      return res.status(400).json({ error: 'Parent ID is required' });
    }

    if (!item.type) {
      return res.status(400).json({ error: 'Item type is required' });
    }

    // Validate UUID format
    if (!isValidUUID(item.id)) {
      return res.status(400).json({ error: 'Invalid UUID format for item ID' });
    }

    if (!isValidUUID(item.parent)) {
      return res.status(400).json({ error: 'Invalid UUID format for parent ID' });
    }

    // Validate item type
    if (!VALID_ITEM_TYPES.includes(item.type)) {
      return res.status(400).json({ error: `Invalid item type. Must be one of: ${VALID_ITEM_TYPES.join(', ')}` });
    }

    // Validate attributes if provided
    if (item.attributes && item.attributes.status) {
      if (!VALID_STATUS_VALUES.includes(item.attributes.status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUS_VALUES.join(', ')}` });
      }
    }

    next();
  };

  /**
   * Validate parent exists (could be a page or another item)
   */
  validateParent = async (req, res, next) => {
    // Only perform this validation during creation, not update
    if (req.method !== 'POST') {
      return next();
    }
    
    const item = req.body;
    const parentId = item.parent;
    
    try {
      // Check if parent is a page
      const parentIsPage = this.pagesMiddleware && await this.pagesMiddleware.hasPage(parentId);
      
      // Check if parent is an item
      const parentIsItem = await this.repository.exists(parentId);
      
      if (!parentIsPage && !parentIsItem) {
        this.logger.warn(`Parent not found with ID: ${parentId}`);
        return res.status(400).json({ error: 'Parent ID does not reference an existing page or item' });
      }
      
      next();
    } catch (error) {
      this.logger.error(`Error validating parent: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Public read-only routes (no auth required)
    this.router.get('/:id', this.getItem.bind(this));
    this.router.get('/', this.getAllItems.bind(this));

    // Protected routes requiring API key
    this.router.post('/', validateApiKey, this.validateItem, this.validateParent, this.createItem.bind(this));
    this.router.put('/:id', validateApiKey, this.validateItem, validateIdMatch, this.updateItem.bind(this));
    this.router.delete('/:id', validateApiKey, this.deleteItem.bind(this));
  }

  /**
   * Get all items
   */
  async getAllItems(req, res) {
    try {
      const items = await this.repository.getAll();
      res.status(200).json(items);
    } catch (error) {
      this.logger.error('Error retrieving all items', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get a specific item
   */
  async getItem(req, res) {
    const id = req.params.id;
    
    try {
      const item = await this.repository.getById(id);
      
      if (!item) {
        this.logger.warn(`Item not found with ID: ${id}`);
        return res.status(404).json({ error: 'Item not found' });
      }
      
      res.status(200).json(item);
    } catch (error) {
      this.logger.error(`Error retrieving item with ID: ${id}`, { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handle item creation
   */
  async createItem(req, res) {
    const item = req.body;
    
    try {
      const id = await this.repository.create(item);
      
      this.logger.info(`Created item with ID: ${id}`);
      res.status(201).json({ success: true, id });
    } catch (error) {
      this.logger.error('Error creating item', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handle item update
   */
  async updateItem(req, res) {
    const id = req.params.id;
    const item = req.body;
    
    try {
      const updated = await this.repository.update(id, item);
      
      if (!updated) {
        this.logger.warn(`Item not found with ID: ${id}`);
        return res.status(404).json({ error: 'Item not found' });
      }
      
      this.logger.info(`Updated item with ID: ${id}`);
      res.status(200).json({ success: true });
    } catch (error) {
      this.logger.error(`Error updating item with ID: ${id}`, { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handle item deletion
   */
  async deleteItem(req, res) {
    const id = req.params.id;
    
    try {
      const exists = await this.repository.exists(id);
      
      if (!exists) {
        this.logger.warn(`Item not found with ID: ${id}`);
        return res.status(404).json({ error: 'Item not found' });
      }
      
      await this.repository.delete(id);
      
      this.logger.info(`Deleted item with ID: ${id}`);
      res.status(204).send();
    } catch (error) {
      this.logger.error(`Error deleting item with ID: ${id}`, { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Check if an item exists (used by other middlewares)
   */
  async hasItem(id) {
    return this.repository.exists(id);
  }

  /**
   * Get data store (for backward compatibility with tests)
   * This creates a Map-like interface that mimics the original in-memory implementation
   * but uses the repository underneath
   */
  getDataStore() {
    const self = this;

    // Create a custom Map-like object with async methods
    const dataStore = {
      // Async get method for database version
      get: async (id) => {
        return await self.repository.getById(id);
      },

      // Async values method for database version
      values: async () => {
        return await self.repository.getAll();
      },

      // Async keys method for database version
      keys: async () => {
        const items = await self.repository.getAll();
        return items.map(item => item.id);
      },

      // Also provide synchronous methods that return dummy values for tests expecting immediate results
      // These will allow backward compatibility with test code that expects sync behavior
      // but should not be used in actual implementation
      set: (id, value) => {
        console.warn('Warning: Using synchronous set on async dataStore');
        return dataStore;
      },

      // Sync fallbacks that return empty arrays/objects
      size: 0
    };

    // Add non-async versions for backward compatibility with direct property access
    Object.defineProperties(dataStore, {
      size: {
        get: function() {
          console.warn('Warning: Accessing synchronous size on async dataStore');
          return 0;
        }
      }
    });

    return dataStore;
  }

  /**
   * Get the router middleware
   */
  getRouter() {
    return this.router;
  }
}

export default ItemsMiddleware;