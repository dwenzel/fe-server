/**
 * Unit tests for validation middleware
 */
import { validateIdMatch } from '../../../src/middleware/validation.js';
import { v4 as uuidv4 } from 'uuid';
import { describe, test, beforeEach, jest, expect } from "@jest/globals";

// Mock request and response
const mockRequest = (body = {}, params = {}, headers = {}) => ({
  body,
  params,
  header: jest.fn(name => headers[name]),
  method: 'GET'
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Validation Middleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  test('validateIdMatch should pass when IDs match', () => {
    const id = uuidv4();
    const req = mockRequest({ id }, { id });
    const res = mockResponse();

    validateIdMatch(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validateIdMatch should reject when IDs do not match', () => {
    const req = mockRequest({ id: uuidv4() }, { id: uuidv4() });
    const res = mockResponse();

    validateIdMatch(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});