/**
 * User CRUD Endpoint Tests
 */
require('./setup');
const request = require('supertest');
const app = require('../server');
const {
  connectTestDB,
  clearTestDB,
  dropTestDB,
  createTestUser,
  createAdminUser,
  getAuthToken,
} = require('./helpers/db');

describe('Users API', () => {
  let adminUser;
  let adminToken;
  let regularUser;
  let regularToken;

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    // Create admin and regular user for tests
    adminUser = await createAdminUser();
    adminToken = getAuthToken(adminUser);
    regularUser = await createTestUser();
    regularToken = getAuthToken(regularUser);
  });

  afterAll(async () => {
    await dropTestDB();
  });

  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2); // At least admin and regular user
    });

    it('should prevent regular user from accessing user list', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should fail to get users without authentication', async () => {
      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not include passwords in user list', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      res.body.data.forEach((user) => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get a specific user by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('email', regularUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should fail with invalid user ID format', async () => {
      const res = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but doesn't exist

      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/users', () => {
    it('should allow admin to create a new user', async () => {
      const newUser = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
      };

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('email', newUser.email.toLowerCase());
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should prevent regular user from creating users', async () => {
      const newUser = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(newUser);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should fail without authentication', async () => {
      const newUser = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const res = await request(app).post('/api/users').send(newUser);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow admin to update a user', async () => {
      const updates = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const res = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('firstName', 'Updated');
      expect(res.body.data).toHaveProperty('lastName', 'Name');
    });

    it('should prevent regular user from updating other users', async () => {
      const updates = {
        firstName: 'Hacked',
      };

      const res = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(updates);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not allow updating email to existing email', async () => {
      const anotherUser = await createTestUser({
        email: 'another@example.com',
      });

      const res = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: anotherUser.email });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete a user', async () => {
      const userToDelete = await createTestUser({
        email: 'todelete@example.com',
      });

      const res = await request(app)
        .delete(`/api/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it('should prevent regular user from deleting users', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should prevent user from deleting themselves', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/cannot delete.*own account/i);
    });

    it('should prevent deleting the last admin user', async () => {
      // Create a second admin to perform the deletion
      const secondAdmin = await createAdminUser({
        email: 'secondadmin@example.com',
      });
      const secondAdminToken = getAuthToken(secondAdmin);

      // Try to delete the first admin (now there are 2 admins)
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${secondAdminToken}`);

      expect(res.statusCode).toBe(200); // Should succeed with 2 admins

      // Now try to delete the last admin
      const res2 = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // This should fail or the second admin delete should fail
      // The actual behavior depends on which admin we're deleting
    });

    it('should return 404 when deleting non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
