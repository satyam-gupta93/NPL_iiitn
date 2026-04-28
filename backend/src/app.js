import cors from 'cors';
import express from 'express';
import auctionRoutes from './routes/auctionRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'IIIT Nagpur Premier League Auction System' });
});

app.use('/players', playerRoutes);
app.use('/auction', auctionRoutes);
app.use('/teams', teamRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
