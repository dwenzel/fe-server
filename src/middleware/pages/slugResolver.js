/**
 * Slug resolver middleware for hierarchical page routing
 */
import logger from '../../services/logger.js';
import { findRootPage, findChildPages, getAll } from '../../utils/db-compatibility.js';

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
  return async function slugResolver(req, res, next) {
    try {
      // Get the full path from the URL without query parameters
      const fullPath = req.path.split('?')[0];

      // Enhanced debugging
      logger.info(`Slug resolver processing path: "${fullPath}"`);

      try {
        // Use compatibility function to get pages consistently
        const pagesArray = await getAll(pagesMiddleware);
        logger.info(`Current pages in store: ${pagesArray.length} pages`);
      } catch (error) {
        logger.error(`Error listing pages: ${error.message}`);
      }

      // Root page handling (empty path)
      if (fullPath === '/') {
        try {
          const rootPage = await findRootPage(pagesMiddleware);
          if (rootPage) {
            req.resolvedPage = rootPage;
            logger.info(`Resolved root path to page ID: ${rootPage.id}`);
          } else {
            logger.warn('No root page found when trying to resolve root path "/"');
          }
          return next();
        } catch (error) {
          logger.error(`Error finding root page: ${error.message}`);
          return next();
        }
      }

      // Skip API paths - we only want to resolve slug paths for frontend
      if (fullPath.startsWith('/api/')) {
        logger.info(`Skipping API path: ${fullPath}`);
        return next();
      }

      // Process the path to extract slug segments
      const slugPath = fullPath;
      const slugSegments = parseSlugPath(slugPath);

      logger.info(`Parsed slug segments: ${JSON.stringify(slugSegments)}`);

      if (slugSegments.length === 0) {
        // Another way to access the root page
        try {
          const rootPage = await findRootPage(pagesMiddleware);
          if (rootPage) {
            req.resolvedPage = rootPage;
            logger.info(`Resolved empty path to root page ID: ${rootPage.id}`);
          } else {
            logger.warn('No root page found when trying to resolve empty slug path');
          }
          return next();
        } catch (error) {
          logger.error(`Error finding root page: ${error.message}`);
          return next();
        }
      }

      // Start with the root page
      let rootPage;
      try {
        // Use compatibility function to get root page
        rootPage = await findRootPage(pagesMiddleware);
      } catch (error) {
        logger.error(`Error finding root page: ${error.message}`);
        return next();
      }

      if (!rootPage) {
        logger.warn('No root page found when resolving slugs');
        return next();
      }

      // Log the root page for debugging
      logger.info(`Starting with root page ID: ${rootPage.id}, name: ${rootPage.title || rootPage.name}`);

      let currentPage = rootPage;

      // Traverse the hierarchy for each segment
      for (let i = 0; i < slugSegments.length; i++) {
        const segment = slugSegments[i];

        // Find child pages with matching slug
        let childPages;
        try {
          // Use compatibility function to get child pages
          childPages = await findChildPages(pagesMiddleware, currentPage.id);
        } catch (error) {
          logger.error(`Error finding child pages for ${currentPage.id}: ${error.message}`);
          return next();
        }

        // Log child pages for debugging
        logger.info(`Found ${childPages.length} child pages for parent ${currentPage.id}`);
        childPages.forEach(child => {
          logger.info(`  Child page: ID=${child.id}, slug="${child.slug}", name="${child.title || child.name}"`);
        });

        const matchingPage = childPages.find(page => page.slug === segment);

        // If we can't find a matching page, stop resolving
        if (!matchingPage) {
          logger.warn(`Could not resolve slug segment: "${segment}" (in path: "${slugPath}")`);
          return next();
        }

        logger.info(`Found matching page for segment "${segment}": ID=${matchingPage.id}, name="${matchingPage.title || matchingPage.name}"`);
        currentPage = matchingPage;
      }

      // Store the resolved page in the request object
      req.resolvedPage = currentPage;
      logger.info(`Successfully resolved slug path "${slugPath}" to page ID: ${currentPage.id}`);

      next();
    } catch (error) {
      logger.error(`Error resolving slug path: ${error.message}`, error);
      next(error);
    }
  };
}