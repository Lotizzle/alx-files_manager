import { expect } from 'chai';
import request from 'supertest';
import app from '../server';

describe('GET /status', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal({ redis: true, db: true });
  });
});

describe('GET /stats', () => {
  it('should return correct stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('users');
    expect(res.body).to.have.property('files');
  });
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('email');
  });
});
