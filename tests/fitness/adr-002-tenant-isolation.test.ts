/**
 * Fitness Function — ADR-002: Multi-Tenant Routing
 * Linked to: adr/adr-002-multi-tenant-routing.md
 * Quality attribute: Security / Tenant Isolation (H/H)
 *
 * Constraint: ALL protected routes MUST return 400 when X-Tenant-Id is absent.
 * Failure means: ADR-002 constraint violated — tenant isolation broken.
 *
 * Registered as: pre-commit quality gate
 */
import request from 'supertest';
import { app } from '../../packages/api-gateway/src/index';

const PROTECTED_ROUTES = ['/api/players', '/api/games', '/api/tenants'];

describe('[Fitness] ADR-002: Tenant Isolation', () => {
  it.each(PROTECTED_ROUTES)(
    '%s without X-Tenant-Id MUST return 400',
    async (route) => {
      // Given: request with no tenant context
      // When: hit a protected route
      const res = await request(app).get(route);

      // Then: gateway rejects with 400 — isolation enforced
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/X-Tenant-Id/);
    },
  );

  it('/health MUST remain accessible without X-Tenant-Id', async () => {
    // Given: ops/monitoring request (no tenant context)
    // When: GET /health
    const res = await request(app).get('/health');

    // Then: always 200 — health is exempt from tenant check
    expect(res.status).toBe(200);
  });
});
