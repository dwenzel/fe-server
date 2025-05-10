/**
 * Content negotiation utilities
 */
import logger from '../services/logger.js';

/**
 * Determines the response format based on request headers and query params
 * @param {Object} req - Express request object
 * @returns {string} Response format ('html' or 'json')
 */
export function determineResponseFormat(req) {
  // Check if explicit JSON format is requested in Accept header
  if (req.get('Accept') === 'application/json') {
    return 'json';
  }
  
  // Check query param first, then Accept header
  const formatFromQuery = req.query.format;
  const formatFromAccept = req.accepts(['html', 'json']);
  
  // Log for debugging
  logger.info(`Content negotiation - Query format: ${formatFromQuery}, Accept format: ${formatFromAccept}`);
  
  return formatFromQuery || formatFromAccept || 'json';
}