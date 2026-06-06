// ─────────────────────────────────────────────────────────────────
// Winston Structured Logger
// JSON in production, colored console in development
// ─────────────────────────────────────────────────────────────────

import winston from 'winston';
import { env } from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const m = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts as string}] ${level}: ${message as string}${m}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
  defaultMeta: { service: 'ai-lead-engine' },
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    ...(env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
          new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
        ]
      : []),
  ],
  exitOnError: false,
});