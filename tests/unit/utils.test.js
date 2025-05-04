/**
 * Unit tests for utility functions
 */
import { isValidUUID, VALID_ITEM_TYPES, VALID_STATUS_VALUES } from '../../src/middleware/utils.js';
import { describe, test, expect } from "@jest/globals";
import { v4 as uuidv4 } from 'uuid';

describe('Utility Functions', () => {
  describe('isValidUUID', () => {
    test('should return true for valid UUIDs', () => {
      const validUUID = uuidv4();
      expect(isValidUUID(validUUID)).toBe(true);
    });

    test('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123456789',
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        '00000000-0000-0000-0000-000000000000',
        null,
        undefined,
        ''
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });

  describe('VALID_ITEM_TYPES', () => {
    test('should contain the expected values', () => {
      expect(VALID_ITEM_TYPES).toContain('dynamic');
      expect(VALID_ITEM_TYPES).toContain('list');
      expect(VALID_ITEM_TYPES).toContain('news');
      expect(VALID_ITEM_TYPES).toContain('project');
      expect(VALID_ITEM_TYPES).toContain('event');
    });
  });

  describe('VALID_STATUS_VALUES', () => {
    test('should contain the expected values', () => {
      expect(VALID_STATUS_VALUES).toContain('Option1');
      expect(VALID_STATUS_VALUES).toContain('Option2');
    });
  });
});