"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("../config/env");
const { combine, timestamp, printf, colorize, errors, json } = winston_1.default.format;
const devFormat = combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), printf(({ level, message, timestamp: ts, ...meta }) => {
    const m = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts}] ${level}: ${message}${m}`;
}));
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
exports.logger = winston_1.default.createLogger({
    level: env_1.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    defaultMeta: { service: 'ai-lead-engine' },
    format: env_1.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    transports: [
        new winston_1.default.transports.Console(),
        ...(env_1.env.NODE_ENV === 'production'
            ? [
                new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
                new winston_1.default.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
            ]
            : []),
    ],
    exitOnError: false,
});
//# sourceMappingURL=logger.js.map