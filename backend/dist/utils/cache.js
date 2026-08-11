"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheStats = exports.setInCache = exports.getFromCache = exports.buildCacheKey = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const cache = new node_cache_1.default({
    stdTTL: env_1.env.CACHE_TTL_SECONDS,
    checkperiod: Math.floor(env_1.env.CACHE_TTL_SECONDS / 2),
    useClones: false,
});
function buildCacheKey(industry, location, service) {
    return `${industry.toLowerCase()}:${location.toLowerCase()}:${service.toLowerCase()}`;
}
exports.buildCacheKey = buildCacheKey;
function getFromCache(key) {
    const value = cache.get(key);
    if (value !== undefined) {
        logger_1.logger.debug('Cache HIT', { key });
        return value;
    }
    logger_1.logger.debug('Cache MISS', { key });
    return null;
}
exports.getFromCache = getFromCache;
function setInCache(key, value) {
    cache.set(key, value);
    logger_1.logger.debug('Cache SET', { key, ttl: env_1.env.CACHE_TTL_SECONDS });
}
exports.setInCache = setInCache;
function getCacheStats() { return cache.getStats(); }
exports.getCacheStats = getCacheStats;
//# sourceMappingURL=cache.js.map