/**
 * Items API Middleware
 */
import { Router } from 'express';
import { isValidUUID, VALID_ITEM_TYPES, VALID_STATUS_VALUES } from './utils.js';
import { validateApiKey } from './auth.js';
import { validateIdMatch } from './validation.js';

class ItemsMiddleware {
  constructor(logger, pagesMiddleware) {
    this.router = Router();
    this.logger = logger;
    this.items = new Map();
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

    // Validate parent exists (could be a page or another item)
    const parentId = item.parent;
    const parentIsPage = this.pagesMiddleware && this.pagesMiddleware.hasPage(parentId);
    const parentIsItem = this.items.has(parentId);
    
    // We only perform this validation during creation, not update
    if (req.method === 'POST' && !parentIsPage && !parentIsItem) {
      this.logger.warn(`Parent not found with ID: ${parentId}`);
      return res.status(400).json({ error: 'Parent ID does not reference an existing page or item' });
    }

    next();
  };

  // Using validateIdMatch from validation.js module

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Apply API key validation to all routes
    this.router.use(validateApiKey);

    // Routes for Items
    this.router.post('/', this.validateItem, this.createItem.bind(this));
    this.router.put('/:id', this.validateItem, validateIdMatch, this.updateItem.bind(this));
    this.router.delete('/:id', this.deleteItem.bind(this));
    this.router.get('/:id', this.getItem.bind(this));
    this.router.get('/', this.getAllItems.bind(this));
  }

  /**
   * Get all items
   */
  getAllItems(req, res) {
    const itemsArray = Array.from(this.items.values());
    res.status(200).json(itemsArray);
  }

  /**
   * Get a specific item
   */
  getItem(req, res) {
    const id = req.params.id;
    
    if (!this.items.has(id)) {
      this.logger.warn(`Item not found with ID: ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = this.items.get(id);
    res.status(200).json(item);
  }

  /**
   * Handle item creation
   */
  createItem(req, res) {
    const item = req.body;
    this.items.set(item.id, item);
    
    this.logger.info(`Created item with ID: ${item.id}`);
    res.status(201).json({ success: true, id: item.id });
  }

  /**
   * Handle item update
   */
  updateItem(req, res) {
    const id = req.params.id;
    
    if (!this.items.has(id)) {
      this.logger.warn(`Item not found with ID: ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = req.body;
    this.items.set(id, item);
    
    this.logger.info(`Updated item with ID: ${id}`);
    res.status(200).json({ success: true });
  }

  /**
   * Handle item deletion
   */
  deleteItem(req, res) {
    const id = req.params.id;
    
    if (!this.items.has(id)) {
      this.logger.warn(`Item not found with ID: ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }
    
    this.items.delete(id);
    
    this.logger.info(`Deleted item with ID: ${id}`);
    res.status(204).send();
  }

  /**
   * Get the router middleware
   */
  getRouter() {
    return this.router;
  }

  /**
   * Get the data store (for testing)
   */
  getDataStore() {
    return this.items;
  }
}

export default ItemsMiddleware;