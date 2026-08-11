// ─────────────────────────────────────────────────────────────────
// Express Server — Helmet, CORS, logging, routes, error handler
// ─────────────────────────────────────────────────────────────────

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter';
import { apiRouter } from './routes/api.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || env.ALLOWED_ORIGINS.includes('*') || env.ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    logger.warn('CORS blocked', { origin });
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json({ limit: '10kb' }));

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('→ Request', { method: req.method, path: req.path, ip: req.ip });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// API
app.use('/api', apiRateLimiter, apiRouter);
app.use('/', apiRateLimiter, apiRouter);

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Error handler
app.use(errorMiddleware);

const server = app.listen(env.PORT, () => {
  logger.info(`Server started`, { port: env.PORT, env: env.NODE_ENV });
});

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('uncaughtException', (err) => { logger.error('Uncaught', { err }); process.exit(1); });
process.on('unhandledRejection', (reason) => { logger.error('Unhandled rejection', { reason }); process.exit(1); });

export default app;