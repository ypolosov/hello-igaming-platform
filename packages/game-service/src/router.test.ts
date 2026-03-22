import request from 'supertest';
import express from 'express';
import { gameRouter } from './router';

const app = express();
app.use(express.json());
app.use(gameRouter);

describe('GameService', () => {
  it('GET /games returns game catalog', async () => {
    const res = await request(app).get('/games');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toMatchObject({ id: expect.any(String), name: expect.any(String), rtp: expect.any(Number) });
  });

  it('GET /games/:id returns a specific game', async () => {
    const res = await request(app).get('/games/g1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Book of Dead');
  });

  it('GET /games/:id returns 404 for unknown game', async () => {
    const res = await request(app).get('/games/unknown');
    expect(res.status).toBe(404);
  });

  it('POST /sessions creates a game session', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ gameId: 'g1', playerId: 'p1' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ gameId: 'g1', playerId: 'p1', status: 'active' });
    expect(res.body.sessionId).toBeDefined();
  });

  it('POST /sessions returns 400 if gameId missing', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ playerId: 'p1' });
    expect(res.status).toBe(400);
  });

  it('POST /sessions returns 404 for unknown game', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ gameId: 'unknown', playerId: 'p1' });
    expect(res.status).toBe(404);
  });
});
