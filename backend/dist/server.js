"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const rateLimiter_1 = require("./middleware/rateLimiter");
const api_routes_1 = require("./routes/api.routes");
const auth_routes_1 = require("./routes/auth.routes");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || env_1.env.ALLOWED_ORIGINS.includes('*') || env_1.env.ALLOWED_ORIGINS.includes(origin))
            return cb(null, true);
        logger_1.logger.warn('CORS blocked', { origin });
        cb(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express_1.default.json({ limit: '10kb' }));
app.use((req, _res, next) => {
    logger_1.logger.info('→ Request', { method: req.method, path: req.path, ip: req.ip });
    next();
});
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', env: env_1.env.NODE_ENV, timestamp: new Date().toISOString() });
});
app.use('/api/auth', rateLimiter_1.apiRateLimiter, auth_routes_1.authRouter);
app.use('/api', rateLimiter_1.apiRateLimiter, api_routes_1.apiRouter);
app.use('/', rateLimiter_1.apiRateLimiter, api_routes_1.apiRouter);
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use(error_middleware_1.errorMiddleware);
const server = app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server started`, { port: env_1.env.PORT, env: env_1.env.NODE_ENV });
});
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('uncaughtException', (err) => { logger_1.logger.error('Uncaught', { err }); process.exit(1); });
process.on('unhandledRejection', (reason) => { logger_1.logger.error('Unhandled rejection', { reason }); process.exit(1); });
exports.default = app;
//# sourceMappingURL=server.js.map