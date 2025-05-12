/**
 * Compatibility functions to help transition from in-memory to database-based storage
 * This module provides helper functions to handle both synchronous and asynchronous
 * data access patterns during the transition to database-backed implementations.
 */

/**
 * Get a page or item by ID from either a sync Map or async repository
 * @param {Object} middleware - The middleware instance (pages or items)
 * @param {string} id - The ID to look up
 * @returns {Promise<Object>} - The retrieved object or null
 */
export async function getById(middleware, id) {
  try {
    // First try repository pattern
    if (middleware.repository && typeof middleware.repository.getById === 'function') {
      return await middleware.repository.getById(id);
    }
    
    // Then try data store pattern with async get
    if (typeof middleware.getDataStore === 'function') {
      const dataStore = middleware.getDataStore();
      
      if (typeof dataStore.get === 'function') {
        // Check if the get method returns a Promise or direct value
        const result = dataStore.get(id);
        if (result && typeof result.then === 'function') {
          return await result;
        }
        return result;
      }
    }
    
    // Finally fall back to direct map access (old pattern)
    if (middleware.pages && middleware.pages instanceof Map) {
      return middleware.pages.get(id);
    }
    
    if (middleware.items && middleware.items instanceof Map) {
      return middleware.items.get(id);
    }
    
    return null;
  } catch (error) {
    console.error(`Error in getById compatibility function: ${error.message}`);
    return null;
  }
}

/**
 * Get all pages or items from either a sync Map or async repository
 * @param {Object} middleware - The middleware instance (pages or items)
 * @returns {Promise<Array>} - Array of all objects
 */
export async function getAll(middleware) {
  try {
    // First try repository pattern
    if (middleware.repository && typeof middleware.repository.getAll === 'function') {
      return await middleware.repository.getAll();
    }
    
    // Then try data store pattern with async values
    if (typeof middleware.getDataStore === 'function') {
      const dataStore = middleware.getDataStore();
      
      if (typeof dataStore.values === 'function') {
        // Check if values method returns a Promise or direct value
        const result = dataStore.values();
        if (result && typeof result.then === 'function') {
          return await result;
        }
        
        // Handle sync Map values iterator
        if (typeof result[Symbol.iterator] === 'function') {
          return Array.from(result);
        }
        
        return result;
      }
    }
    
    // Finally fall back to direct map access (old pattern)
    if (middleware.pages && middleware.pages instanceof Map) {
      return Array.from(middleware.pages.values());
    }
    
    if (middleware.items && middleware.items instanceof Map) {
      return Array.from(middleware.items.values());
    }
    
    return [];
  } catch (error) {
    console.error(`Error in getAll compatibility function: ${error.message}`);
    return [];
  }
}

/**
 * Find the root page from a pages middleware instance
 * @param {Object} pagesMiddleware - The pages middleware instance
 * @returns {Promise<Object>} - The root page or null
 */
export async function findRootPage(pagesMiddleware) {
  try {
    // Try the repository method first
    if (pagesMiddleware.repository && typeof pagesMiddleware.repository.findRootPage === 'function') {
      return await pagesMiddleware.repository.findRootPage();
    }
    
    // Try the middleware method
    if (typeof pagesMiddleware.findRootPage === 'function') {
      const result = pagesMiddleware.findRootPage();
      if (result && typeof result.then === 'function') {
        return await result;
      }
      return result;
    }
    
    // Fall back to manual search
    const pages = await getAll(pagesMiddleware);
    return pages.find(page => page.isRoot === true);
  } catch (error) {
    console.error(`Error in findRootPage compatibility function: ${error.message}`);
    return null;
  }
}

/**
 * Find child pages for a given parent ID
 * @param {Object} pagesMiddleware - The pages middleware instance
 * @param {string} parentId - The parent page ID
 * @returns {Promise<Array>} - Array of child pages
 */
export async function findChildPages(pagesMiddleware, parentId) {
  try {
    // Try the repository method first
    if (pagesMiddleware.repository && typeof pagesMiddleware.repository.findChildPages === 'function') {
      return await pagesMiddleware.repository.findChildPages(parentId);
    }
    
    // Try the middleware method
    if (typeof pagesMiddleware.findChildPages === 'function') {
      const result = pagesMiddleware.findChildPages(parentId);
      if (result && typeof result.then === 'function') {
        return await result;
      }
      return result;
    }
    
    // Fall back to manual search
    const pages = await getAll(pagesMiddleware);
    return pages.filter(page => page.parent === parentId);
  } catch (error) {
    console.error(`Error in findChildPages compatibility function: ${error.message}`);
    return [];
  }
}

/**
 * Check if a parent exists with the given ID
 * @param {Object} middleware - The middleware instance (pages or items)
 * @param {string} id - The ID to check
 * @returns {Promise<boolean>} - True if it exists
 */
export async function exists(middleware, id) {
  try {
    // Try the repository method first
    if (middleware.repository && typeof middleware.repository.exists === 'function') {
      return await middleware.repository.exists(id);
    }
    
    // Try the hasPage/hasItem methods
    if (typeof middleware.hasPage === 'function') {
      const result = middleware.hasPage(id);
      if (result && typeof result.then === 'function') {
        return await result;
      }
      return result;
    }
    
    if (typeof middleware.hasItem === 'function') {
      const result = middleware.hasItem(id);
      if (result && typeof result.then === 'function') {
        return await result;
      }
      return result;
    }
    
    // Fall back to checking if we can get the item
    const item = await getById(middleware, id);
    return item !== null && item !== undefined;
  } catch (error) {
    console.error(`Error in exists compatibility function: ${error.message}`);
    return false;
  }
}