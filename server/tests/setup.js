/**
 * Test setup file
 * Runs before all tests to configure the test environment
 */

// Load environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only-12345678901234567890';
process.env.JWT_EXPIRE = '7d';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-manager-test';
process.env.PORT = '5001';
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Suppress console errors and logs during tests
// These errors are intentional (testing error cases) but clutter test output
// To see console output while debugging, run: npm test -- --verbose
const originalError = console.error;
const originalLog = console.log;

console.error = jest.fn();
console.log = jest.fn();

// Keep warn and info available for important messages
// Restore on test failure for debugging
afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
});
