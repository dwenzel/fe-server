/**
 * Unit tests for utility functions
 */
import { isValidUUID, VALID_ITEM_TYPES, VALID_STATUS_VALUES } from '../../../src/middleware/utils.js';
import { describe, test, expect } from "@jest/globals";
import { v4 as uuidv4 } from 'uuid';

describe('Utils', () => {
  test('isValidUUID should validate correct UUID format', () => {
    const validUuid = uuidv4();
    expect(isValidUUID(validUuid)).toBe(true);
  });

  test('isValidUUID should reject invalid UUID format', () => {
    const invalidUuids = [
      'not-a-uuid',
      '12345678-1234-1234-1234-1234567890ab-extra',
      '12345678-1234-1234-1234',
      '',
      null,
      undefined
    ];

    invalidUuids.forEach(uuid => {
      expect(isValidUUID(uuid)).toBe(false);
    });
  });

  test('VALID_ITEM_TYPES should be an array of supported item types', () => {
    expect(Array.isArray(VALID_ITEM_TYPES)).toBe(true);
    expect(VALID_ITEM_TYPES.length).toBeGreaterThan(0);
  });

  test('VALID_STATUS_VALUES should be an array of supported status values', () => {
    expect(Array.isArray(VALID_STATUS_VALUES)).toBe(true);
    expect(VALID_STATUS_VALUES.length).toBeGreaterThan(0);
  });
});