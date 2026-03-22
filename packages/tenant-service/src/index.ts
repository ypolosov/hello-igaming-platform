import express from 'express';
import { tenantRouter } from './router';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use(tenantRouter);

app.get('/health', (_req, res) => {
  res.json({ service: 'tenant-service', status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`tenant-service listening on :${PORT}`);
  });
}

export { app };
