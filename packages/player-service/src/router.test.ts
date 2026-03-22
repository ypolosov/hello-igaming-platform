import request from 'supertest';
import express from 'express';
import { playerRouter, clearPlayers } from './router';

const app = express();
app.use(express.json());
app.use(playerRouter);

describe('PlayerService', () => {
  beforeEach(() => {
    clearPlayers();
  });

  it('GET /players returns list', async () => {
    const res = await request(app).get('/players');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /players creates a player', async () => {
    const res = await request(app)
      .post('/players')
      .send({ tenantId: 't1', username: 'john_doe' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ tenantId: 't1', username: 'john_doe', balance: 0 });
    expect(res.body.id).toBeDefined();
  });

  it('POST /players returns 400 if username missing', async () => {
    const res = await request(app)
      .post('/players')
      .send({ tenantId: 't1' });
    expect(res.status).toBe(400);
  });

  it('POST /players/:id/deposit adds balance', async () => {
    const player = await request(app)
      .post('/players')
      .send({ tenantId: 't1', username: 'depositor' });
    const res = await request(app)
      .post(`/players/${player.body.id}/deposit`)
      .send({ amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(100);
  });

  it('POST /players/:id/deposit returns 400 for negative amount', async () => {
    const player = await request(app)
      .post('/players')
      .send({ tenantId: 't1', username: 'neg_test' });
    const res = await request(app)
      .post(`/players/${player.body.id}/deposit`)
      .send({ amount: -50 });
    expect(res.status).toBe(400);
  });

  describe('Tenant-scoped player filtering (ADR-002)', () => {
    it('AC-1: GET /players with X-Tenant-Id returns only players belonging to that tenant', async () => {
      // Given: one player for tenant-A and one for tenant-B
      await request(app)
        .post('/players')
        .send({ tenantId: 'tenant-A', username: 'alice' });
      await request(app)
        .post('/players')
        .send({ tenantId: 'tenant-B', username: 'bob' });

      // When: GET /players with X-Tenant-Id: tenant-A
      const res = await request(app)
        .get('/players')
        .set('X-Tenant-Id', 'tenant-A');

      // Then: only tenant-A players are returned
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ tenantId: 'tenant-A', username: 'alice' });
    });

    it('AC-2: Players created with tenantId tenant-B are NOT visible to tenant-A requests', async () => {
      // Given: a player belonging to tenant-B
      await request(app)
        .post('/players')
        .send({ tenantId: 'tenant-B', username: 'bob' });

      // When: GET /players with X-Tenant-Id: tenant-A
      const res = await request(app)
        .get('/players')
        .set('X-Tenant-Id', 'tenant-A');

      // Then: no tenant-B players are visible
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
      const tenantBPlayers = res.body.filter((p: { tenantId: string }) => p.tenantId === 'tenant-B');
      expect(tenantBPlayers).toHaveLength(0);
    });
  });
});
