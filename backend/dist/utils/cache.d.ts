import NodeCache from 'node-cache';
export declare function buildCacheKey(industry: string, location: string, service: string): string;
export declare function getFromCache<T>(key: string): T | null;
export declare function setInCache<T>(key: string, value: T): void;
export declare function getCacheStats(): NodeCache.Stats;
