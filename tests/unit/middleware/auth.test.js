/**
 * Unit tests for Auth middleware
 */
import { validateApiKey } from '../../../src/middleware/auth.js';
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

describe('Auth Middleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  test('validateApiKey should pass with valid key', () => {
    const req = mockRequest({}, {}, { 'X-Api-Key': 'test-api-key' });
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('validateApiKey should reject with invalid key', () => {
    const req = mockRequest({}, {}, { 'X-Api-Key': 'wrong-key' });
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  test('validateApiKey should reject with missing key', () => {
    const req = mockRequest();
    const res = mockResponse();

    validateApiKey(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});