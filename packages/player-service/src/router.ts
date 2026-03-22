import { Router, Request, Response } from 'express';

export interface Player {
  id: string;
  tenantId: string;
  username: string;
  balance: number;
  createdAt: string;
}

const players = new Map<string, Player>();
let nextId = 1;

export function clearPlayers(): void {
  players.clear();
  nextId = 1;
}

export const playerRouter = Router();

playerRouter.get('/players', (req: Request, res: Response) => {
  const tenantId = req.headers['x-tenant-id'] as string | undefined;
  const all = Array.from(players.values());
  const result = tenantId ? all.filter(p => p.tenantId === tenantId) : all;
  res.json(result);
});

playerRouter.get('/players/:id', (req: Request, res: Response) => {
  const player = players.get(req.params.id);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  res.json(player);
});

playerRouter.post('/players', (req: Request, res: Response) => {
  const { tenantId, username } = req.body as { tenantId?: string; username?: string };
  if (!tenantId || !username) {
    res.status(400).json({ error: 'tenantId and username are required' });
    return;
  }
  const player: Player = {
    id: String(nextId++),
    tenantId,
    username,
    balance: 0,
    createdAt: new Date().toISOString(),
  };
  players.set(player.id, player);
  res.status(201).json(player);
});

playerRouter.post('/players/:id/deposit', (req: Request, res: Response) => {
  const player = players.get(req.params.id);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const { amount } = req.body as { amount?: number };
  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'amount must be positive' });
    return;
  }
  player.balance += amount;
  res.json({ id: player.id, balance: player.balance });
});
