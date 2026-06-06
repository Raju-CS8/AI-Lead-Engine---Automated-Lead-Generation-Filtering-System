// ─────────────────────────────────────────────────────────────────
// Cache — TTL in-memory cache, prevents redundant Overpass calls
// ─────────────────────────────────────────────────────────────────

import NodeCache from 'node-cache';
import { env } from '../config/env';
import { logger } from './logger';

const cache = new NodeCache({
  stdTTL: env.CACHE_TTL_SECONDS,
  checkperiod: Math.floor(env.CACHE_TTL_SECONDS / 2),
  useClones: false,
});

export function buildCacheKey(industry: string, location: string, service: string): string {
  return `${industry.toLowerCase()}:${location.toLowerCase()}:${service.toLowerCase()}`;
}

export function getFromCache<T>(key: string): T | null {
  const value = cache.get<T>(key);
  if (value !== undefined) { logger.debug('Cache HIT', { key }); return value; }
  logger.debug('Cache MISS', { key });
  return null;
}

export function setInCache<T>(key: string, value: T): void {
  cache.set(key, value);
  logger.debug('Cache SET', { key, ttl: env.CACHE_TTL_SECONDS });
}

export function getCacheStats() { return cache.getStats(); }