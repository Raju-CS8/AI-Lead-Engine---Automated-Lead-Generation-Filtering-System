"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const result = await (0, auth_service_1.registerUser)(email, name, password);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        if (err.message === 'User already exists') {
            res.status(409).json({ success: false, error: err.message });
        }
        else {
            next(err);
        }
    }
});
exports.authRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        if (err.message === 'Invalid email or password') {
            res.status(401).json({ success: false, error: err.message });
        }
        else {
            next(err);
        }
    }
});
//# sourceMappingURL=auth.routes.js.map