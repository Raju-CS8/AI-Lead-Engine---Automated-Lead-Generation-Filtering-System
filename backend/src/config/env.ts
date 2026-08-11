import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  ALLOWED_ORIGINS: string[];
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CACHE_TTL_SECONDS: number;
  OVERPASS_TIMEOUT_MS: number;
  JWT_SECRET: string;
}

function getEnvInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) throw new Error(`[ENV] ${key} must be integer. Got: "${raw}"`);
  return parsed;
}

function loadConfig(): EnvConfig {
  const originsRaw = process.env['ALLOWED_ORIGINS'] ?? 'http://localhost:5173';
  return {
    NODE_ENV: process.env['NODE_ENV'] ?? 'development',
    PORT: getEnvInt('PORT', 5000),
    ALLOWED_ORIGINS: originsRaw.split(',').map((o) => o.trim()),
    RATE_LIMIT_WINDOW_MS: getEnvInt('RATE_LIMIT_WINDOW_MS', 900000),
    RATE_LIMIT_MAX_REQUESTS: getEnvInt('RATE_LIMIT_MAX_REQUESTS', 100),
    CACHE_TTL_SECONDS: getEnvInt('CACHE_TTL_SECONDS', 300),
    OVERPASS_TIMEOUT_MS: getEnvInt('OVERPASS_TIMEOUT_MS', 25000),
    JWT_SECRET: process.env['JWT_SECRET'] ?? 'default_secret_please_change_in_production',
  };
}

export const env = loadConfig();