"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvInt(key, fallback) {
    const raw = process.env[key];
    if (!raw)
        return fallback;
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed))
        throw new Error(`[ENV] ${key} must be integer. Got: "${raw}"`);
    return parsed;
}
function loadConfig() {
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
exports.env = loadConfig();
//# sourceMappingURL=env.js.map