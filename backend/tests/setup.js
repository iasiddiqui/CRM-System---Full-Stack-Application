// Test setup file
// Add any global test configuration here

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db?schema=public';
process.env.PORT = process.env.PORT || '0'; // Use random port in tests

