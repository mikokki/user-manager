/**
 * Database helper utilities for tests
 */
const mongoose = require('mongoose');
const User = require('../../models/User');

/**
 * Connect to test database
 */
const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('Test DB connection error:', error);
    throw error;
  }
};

/**
 * Clear all collections in the test database
 */
const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Drop entire test database and close connection
 */
const dropTestDB = async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error dropping test database:', error);
  }
};

/**
 * Close database connection without dropping
 */
const closeTestDB = async () => {
  await mongoose.connection.close();
};

/**
 * Create a test user
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    status: 'active',
  };

  const user = await User.create({ ...defaultUser, ...userData });
  return user;
};

/**
 * Create an admin user
 */
const createAdminUser = async (userData = {}) => {
  const defaultAdmin = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  };

  const admin = await User.create({ ...defaultAdmin, ...userData });
  return admin;
};

/**
 * Generate auth token for a user
 */
const getAuthToken = (user) => {
  return user.generateAuthToken();
};

module.exports = {
  connectTestDB,
  clearTestDB,
  closeTestDB,
  dropTestDB,
  createTestUser,
  createAdminUser,
  getAuthToken,
};
