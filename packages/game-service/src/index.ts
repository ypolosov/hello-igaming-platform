import express from 'express';
import { gameRouter } from './router';

const app = express();
const PORT = Number(process.env.PORT ?? 3003);

app.use(express.json());
app.use(gameRouter);

app.get('/health', (_req, res) => {
  res.json({ service: 'game-service', status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`game-service listening on :${PORT}`);
  });
}

export { app };
