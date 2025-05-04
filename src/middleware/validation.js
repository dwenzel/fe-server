/**
 * Common validation middleware functions
 */

/**
 * Validate URL ID matches body ID
 */
export const validateIdMatch = (req, res, next) => {
  const urlId = req.params.id;
  const bodyId = req.body.id;

  if (urlId !== bodyId) {
    return res.status(400).json({ error: 'URL ID must match body ID' });
  }

  next();
};