"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorMiddleware = void 0;
const logger_1 = require("../utils/logger");
function errorMiddleware(err, req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.isOperational ? err.message : 'An unexpected error occurred.';
    logger_1.logger.error('Unhandled error', { message: err.message, path: req.path, statusCode });
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
    });
}
exports.errorMiddleware = errorMiddleware;
function createError(message, statusCode) {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.isOperational = true;
    return err;
}
exports.createError = createError;
//# sourceMappingURL=error.middleware.js.map