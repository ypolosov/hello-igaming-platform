import { Router, Request, Response } from 'express';

export interface Game {
  id: string;
  name: string;
  provider: string;
  rtp: number;
}

export interface GameSession {
  sessionId: string;
  gameId: string;
  playerId: string;
  status: 'active' | 'completed';
  startedAt: string;
}

const GAMES: Game[] = [
  { id: 'g1', name: 'Book of Dead', provider: 'Play\'n GO', rtp: 96.21 },
  { id: 'g2', name: 'Sweet Bonanza', provider: 'Pragmatic Play', rtp: 96.49 },
  { id: 'g3', name: 'Lightning Roulette', provider: 'Evolution', rtp: 97.30 },
];

const sessions = new Map<string, GameSession>();
let nextSessionId = 1;

export const gameRouter = Router();

gameRouter.get('/games', (_req: Request, res: Response) => {
  res.json(GAMES);
});

gameRouter.get('/games/:id', (req: Request, res: Response) => {
  const game = GAMES.find(g => g.id === req.params.id);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  res.json(game);
});

gameRouter.post('/sessions', (req: Request, res: Response) => {
  const { gameId, playerId } = req.body as { gameId?: string; playerId?: string };
  if (!gameId || !playerId) {
    res.status(400).json({ error: 'gameId and playerId are required' });
    return;
  }
  const game = GAMES.find(g => g.id === gameId);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  const session: GameSession = {
    sessionId: String(nextSessionId++),
    gameId,
    playerId,
    status: 'active',
    startedAt: new Date().toISOString(),
  };
  sessions.set(session.sessionId, session);
  res.status(201).json(session);
});

gameRouter.get('/sessions/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});
