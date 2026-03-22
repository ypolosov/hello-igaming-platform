import { Router, Request, Response, NextFunction } from 'express';

export const gatewayRouter = Router();

// ADR-002: X-Tenant-Id header required for all routes except /health
function requireTenantId(req: Request, res: Response, next: NextFunction): void {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) {
    res.status(400).json({ error: 'X-Tenant-Id header is required' });
    return;
  }
  next();
}

gatewayRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'api-gateway',
    status: 'ok',
    version: '0.1.0',
    upstream: {
      tenantService: process.env.TENANT_SERVICE_URL ?? 'http://localhost:3001',
      playerService: process.env.PLAYER_SERVICE_URL ?? 'http://localhost:3002',
      gameService: process.env.GAME_SERVICE_URL ?? 'http://localhost:3003',
    },
  });
});

// Protected routes require tenant context (ADR-002)
gatewayRouter.get('/api/tenants', requireTenantId, (_req: Request, res: Response) => {
  res.json({ message: 'Proxied to tenant-service', tenantId: _req.headers['x-tenant-id'] });
});

gatewayRouter.get('/api/players', requireTenantId, (_req: Request, res: Response) => {
  res.json({ message: 'Proxied to player-service', tenantId: _req.headers['x-tenant-id'] });
});

gatewayRouter.get('/api/games', requireTenantId, (_req: Request, res: Response) => {
  res.json({ message: 'Proxied to game-service', tenantId: _req.headers['x-tenant-id'] });
});
