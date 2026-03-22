import express from 'express';
import { gatewayRouter } from './router';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use(gatewayRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`api-gateway listening on :${PORT}`);
  });
}

export { app };
