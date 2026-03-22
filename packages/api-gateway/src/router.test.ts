import request from 'supertest';
import express from 'express';
import { gatewayRouter } from './router';

const app = express();
app.use(express.json());
app.use(gatewayRouter);

describe('APIGateway', () => {
  it('GET /health returns ok (no tenant required)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ service: 'api-gateway', status: 'ok' });
    expect(res.body.upstream).toBeDefined();
  });

  // ADR-002: X-Tenant-Id validation fitness function
  describe('Tenant Isolation (ADR-002)', () => {
    it('GET /api/players without X-Tenant-Id returns 400', async () => {
      const res = await request(app).get('/api/players');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/X-Tenant-Id/);
    });

    it('GET /api/games without X-Tenant-Id returns 400', async () => {
      const res = await request(app).get('/api/games');
      expect(res.status).toBe(400);
    });

    it('GET /api/tenants without X-Tenant-Id returns 400', async () => {
      const res = await request(app).get('/api/tenants');
      expect(res.status).toBe(400);
    });

    it('GET /api/players with X-Tenant-Id passes gateway', async () => {
      const res = await request(app)
        .get('/api/players')
        .set('X-Tenant-Id', 'operator-royal-casino');
      expect(res.status).toBe(200);
      expect(res.body.tenantId).toBe('operator-royal-casino');
    });

    it('GET /api/games with X-Tenant-Id passes gateway', async () => {
      const res = await request(app)
        .get('/api/games')
        .set('X-Tenant-Id', 'operator-lucky-stars');
      expect(res.status).toBe(200);
    });
  });
});
