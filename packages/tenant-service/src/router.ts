import { Router, Request, Response } from 'express';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

const tenants = new Map<string, Tenant>();
let nextId = 1;

export const tenantRouter = Router();

tenantRouter.get('/tenants', (_req: Request, res: Response) => {
  res.json(Array.from(tenants.values()));
});

tenantRouter.get('/tenants/:id', (req: Request, res: Response) => {
  const tenant = tenants.get(req.params.id);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }
  res.json(tenant);
});

tenantRouter.post('/tenants', (req: Request, res: Response) => {
  const { name, domain } = req.body as { name?: string; domain?: string };
  if (!name || !domain) {
    res.status(400).json({ error: 'name and domain are required' });
    return;
  }
  const tenant: Tenant = {
    id: String(nextId++),
    name,
    domain,
    createdAt: new Date().toISOString(),
  };
  tenants.set(tenant.id, tenant);
  res.status(201).json(tenant);
});
