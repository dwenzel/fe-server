/**
 * Utility functions shared across the API
 */
import config from '../config.js';

// UUID validation helper
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Valid item types enum from config
export const VALID_ITEM_TYPES = config.itemTypes;

// Valid attribute status values from config
export const VALID_STATUS_VALUES = config.statusValues;