import request from 'supertest';
import express from 'express';
import { tenantRouter } from './router';

const app = express();
app.use(express.json());
app.use(tenantRouter);

describe('TenantService', () => {
  it('GET /tenants returns empty list initially', async () => {
    const res = await request(app).get('/tenants');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /tenants creates a tenant', async () => {
    const res = await request(app)
      .post('/tenants')
      .send({ name: 'Casino Royal', domain: 'royal.casino' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Casino Royal', domain: 'royal.casino' });
    expect(res.body.id).toBeDefined();
  });

  it('POST /tenants returns 400 if name missing', async () => {
    const res = await request(app)
      .post('/tenants')
      .send({ domain: 'royal.casino' });
    expect(res.status).toBe(400);
  });

  it('GET /tenants/:id returns tenant', async () => {
    const created = await request(app)
      .post('/tenants')
      .send({ name: 'Lucky Stars', domain: 'lucky.stars' });
    const res = await request(app).get(`/tenants/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Lucky Stars');
  });

  it('GET /tenants/:id returns 404 for unknown tenant', async () => {
    const res = await request(app).get('/tenants/9999');
    expect(res.status).toBe(404);
  });
});
