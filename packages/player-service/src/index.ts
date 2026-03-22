import express from 'express';
import { playerRouter } from './router';

const app = express();
const PORT = Number(process.env.PORT ?? 3002);

app.use(express.json());
app.use(playerRouter);

app.get('/health', (_req, res) => {
  res.json({ service: 'player-service', status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`player-service listening on :${PORT}`);
  });
}

export { app };
