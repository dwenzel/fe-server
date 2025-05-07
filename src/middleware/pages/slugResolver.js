/**
 * Slug resolver middleware for hierarchical page routing
 */
import logger from '../../services/logger.js';

/**
 * Converts a slug path into segments
 * @param {string} slugPath - The path with slug segments
 * @returns {string[]} Array of slug segments
 */
export function parseSlugPath(slugPath) {
  // Remove leading and trailing slashes, then split by /
  return slugPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
}

/**
 * Create the slug resolver middleware
 * @param {Object} pagesMiddleware - The pages middleware instance
 * @returns {Function} Express middleware function
 */
export function createSlugResolver(pagesMiddleware) {
  return function slugResolver(req, res, next) {
    // Get the full path from the URL without query parameters
    const fullPath = req.path.split('?')[0];
    
    // Root page handling (empty path)
    if (fullPath === '/') {
      const rootPage = pagesMiddleware.findRootPage();
      if (rootPage) {
        req.resolvedPage = rootPage;
        logger.info(`Resolved root path to page ID: ${rootPage.id}`);
      }
      return next();
    }
    
    // Skip API paths - we only want to resolve slug paths for frontend
    if (fullPath.startsWith('/api/')) {
      return next();
    }
    
    // Process the path to extract slug segments
    const slugPath = fullPath;
    const slugSegments = parseSlugPath(slugPath);
    
    if (slugSegments.length === 0) {
      // Another way to access the root page
      const rootPage = pagesMiddleware.findRootPage();
      if (rootPage) {
        req.resolvedPage = rootPage;
        logger.info(`Resolved empty path to root page ID: ${rootPage.id}`);
      }
      return next();
    }
    
    try {
      // Start with the root page
      let currentPage = pagesMiddleware.findRootPage();
      
      if (!currentPage) {
        logger.warn('No root page found when resolving slugs');
        return next();
      }
      
      // Traverse the hierarchy for each segment
      for (let i = 0; i < slugSegments.length; i++) {
        const segment = slugSegments[i];
        
        // Find child pages with matching slug
        const childPages = pagesMiddleware.findChildPages(currentPage.id);
        const matchingPage = childPages.find(page => page.slug === segment);
        
        // If we can't find a matching page, stop resolving
        if (!matchingPage) {
          logger.warn(`Could not resolve slug segment: ${segment} (in path: ${slugPath})`);
          return next();
        }
        
        currentPage = matchingPage;
      }
      
      // Store the resolved page in the request object
      req.resolvedPage = currentPage;
      logger.info(`Resolved slug path "${slugPath}" to page ID: ${currentPage.id}`);
      
      next();
    } catch (error) {
      logger.error(`Error resolving slug path: ${error.message}`, error);
      next(error);
    }
  };
}