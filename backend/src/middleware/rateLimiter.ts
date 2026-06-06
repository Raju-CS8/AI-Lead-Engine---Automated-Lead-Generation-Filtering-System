import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please slow down.' },
  handler: (req, res, _next, options) => {
    logger.warn('Rate limit hit', { ip: req.ip, path: req.path });
    res.status(429).json(options.message);
  },
});