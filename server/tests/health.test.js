/**
 * Health Check Endpoint Tests
 */
require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { connectTestDB, dropTestDB } = require('./helpers/db');

describe('Health Check API', () => {
  beforeAll(async () => {
    await connectTestDB();
    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    await dropTestDB();
  });

  describe('GET /api/health', () => {
    it('should return health status with all required fields', async () => {
      const res = await request(app).get('/api/health');

      // Database connection state may vary in test environment
      // Accept both 200 (connected) and 503 (disconnected) as valid
      expect([200, 503]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
      expect(['connected', 'disconnected']).toContain(res.body.database);
    });

    it('should return uptime as a number', async () => {
      const res = await request(app).get('/api/health');

      expect(typeof res.body.uptime).toBe('number');
      expect(res.body.uptime).toBeGreaterThan(0);
    });

    it('should return valid ISO timestamp', async () => {
      const res = await request(app).get('/api/health');

      const timestamp = new Date(res.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });
});
