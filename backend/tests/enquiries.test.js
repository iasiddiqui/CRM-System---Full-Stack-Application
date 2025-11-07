const request = require('supertest');
const app = require('../src/server');

describe('Enquiry Endpoints', () => {
  let authToken;
  let employeeId;

  beforeAll(async () => {
    // Register and login to get token
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'enquiry@example.com',
        password: 'password123',
        name: 'Enquiry Test User'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'enquiry@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;
    employeeId = loginResponse.body.data.employee.id;
  });

  describe('POST /api/enquiries/public', () => {
    it('should create a public enquiry without authentication', async () => {
      const response = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          message: 'This is a test enquiry message that is long enough'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('John Doe');
    });

    it('should create enquiry without phone (optional)', async () => {
      const response = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'This is another test enquiry message'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for short message', async () => {
      const response = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Short'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/enquiries/unclaimed', () => {
    it('should return unclaimed enquiries for authenticated user', async () => {
      // Create some unclaimed enquiries first
      await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'Unclaimed 1',
          email: 'unclaimed1@example.com',
          message: 'This is an unclaimed enquiry message'
        });

      const response = await request(app)
        .get('/api/enquiries/unclaimed')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/enquiries/unclaimed');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/enquiries/:id/claim', () => {
    let enquiryId;

    beforeEach(async () => {
      // Create an unclaimed enquiry
      const enquiryResponse = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'Claim Test',
          email: 'claim@example.com',
          message: 'This enquiry will be claimed'
        });

      enquiryId = enquiryResponse.body.data.id;
    });

    it('should claim an enquiry atomically', async () => {
      const response = await request(app)
        .post(`/api/enquiries/${enquiryId}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.claimedBy).toBe(employeeId);
    });

    it('should return 409 when trying to claim already claimed enquiry', async () => {
      // Claim the enquiry first
      await request(app)
        .post(`/api/enquiries/${enquiryId}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      // Try to claim again
      const response = await request(app)
        .post(`/api/enquiries/${enquiryId}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent enquiry', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .post(`/api/enquiries/${fakeId}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/enquiries/${enquiryId}/claim`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/enquiries/mine', () => {
    it('should return enquiries claimed by logged-in employee', async () => {
      // Create and claim an enquiry
      const enquiryResponse = await request(app)
        .post('/api/enquiries/public')
        .send({
          name: 'My Enquiry',
          email: 'my@example.com',
          message: 'This is my enquiry message'
        });

      await request(app)
        .post(`/api/enquiries/${enquiryResponse.body.data.id}/claim`)
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .get('/api/enquiries/mine')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/enquiries/mine');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

