/**
 * Authentication middleware
 */
import config from '../config.js';

/**
 * API key validation middleware
 * This is extracted to a separate file so it can be reused across middlewares
 */
export const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-Api-Key');
  const validApiKey = config.api.key;
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  
  next();
};