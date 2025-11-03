/**
 * Authentication Endpoint Tests
 */
require('./setup');
const request = require('supertest');
const app = require('../server');
const {
  connectTestDB,
  clearTestDB,
  dropTestDB,
  createTestUser,
  getAuthToken,
} = require('./helpers/db');

describe('Authentication API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await dropTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('email', userData.email.toLowerCase());
      expect(res.body.data).toHaveProperty('firstName', userData.firstName);
      expect(res.body.data).toHaveProperty('lastName', userData.lastName);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail registration with missing required fields', async () => {
      const userData = {
        email: 'incomplete@example.com',
        // Missing firstName, lastName, password
      };

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should fail registration with invalid email format', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should fail registration with duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Create first user
      await request(app).post('/api/auth/register').send(userData);

      // Try to create duplicate
      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/email.*exists/i);
    });

    it('should fail registration with password shorter than 6 characters', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '12345', // Only 5 characters
      };

      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await createTestUser({
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('email', 'login@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/invalid.*credentials/i);
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/invalid.*credentials/i);
    });

    it('should fail login with missing email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should fail login with missing password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should fail login for inactive user', async () => {
      await createTestUser({
        email: 'inactive@example.com',
        password: 'password123',
        status: 'inactive',
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'inactive@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/inactive/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const user = await createTestUser({
        email: 'currentuser@example.com',
      });
      const token = getAuthToken(user);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('email', 'currentuser@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail without authentication token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/no token/i);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-12345');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/invalid.*token/i);
    });
  });
});
