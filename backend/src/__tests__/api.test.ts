import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { dbService } from '../services/db.service';

describe('Portfolio REST API Test Suite', () => {
  let app: any;
  let adminToken: string;

  beforeAll(async () => {
    await dbService.init();
    app = createApp();
  });

  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/profile should return public profile', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('fullName');
  });

  it('GET /api/skills should return skills list', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/projects should return projects list', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/auth/login with valid credentials should return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@alexmorgan.dev', password: 'AdminPassword123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    adminToken = res.body.data.token;
  });

  it('POST /api/auth/login with invalid password should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@alexmorgan.dev', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/contact should validate message payload and store it', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Project Inquiry',
      message: 'Hello Alex, I would love to discuss a project with you.',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/contact with invalid email should fail validation with 400', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'not-an-email',
      subject: 'Inquiry',
      message: 'Short',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('Protected route PUT /api/profile without token should return 401', async () => {
    const res = await request(app).put('/api/profile').send({
      fullName: 'Hacker',
    });

    expect(res.status).toBe(401);
  });

  it('Protected route with valid token should succeed', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Alex Morgan',
        professionalTitle: 'Principal Full-Stack Architect',
        shortBio: 'Updated bio for testing purposes',
        longBio: 'Updated long bio for testing purposes with sufficient length',
        location: 'San Francisco, CA',
        email: 'alex@alexmorgan.dev',
        availabilityStatus: 'Open for consulting',
        yearsOfExperience: 8,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
