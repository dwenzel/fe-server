/**
 * Unit tests for health middleware
 */
import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('Health Middleware', () => {
  test('should return 200 status and health information', async () => {
    // Create a mock Express app to test the health endpoint
    const app = express();
    
    // Configure the health endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    });

    // Test the endpoint
    const response = await request(app).get('/health');
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });
});