"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests. Please slow down.' },
    handler: (req, res, _next, options) => {
        logger_1.logger.warn('Rate limit hit', { ip: req.ip, path: req.path });
        res.status(429).json(options.message);
    },
});
//# sourceMappingURL=rateLimiter.js.map