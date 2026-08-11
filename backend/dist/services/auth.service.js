"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const DB_PATH = path_1.default.join(__dirname, '../../users.json');
function loadUsers() {
    if (!fs_1.default.existsSync(DB_PATH)) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify([]), 'utf-8');
        return [];
    }
    try {
        return JSON.parse(fs_1.default.readFileSync(DB_PATH, 'utf-8'));
    }
    catch (err) {
        return [];
    }
}
function saveUsers(users) {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}
async function registerUser(email, name, passwordPlain) {
    const users = loadUsers();
    if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash(passwordPlain, salt);
    const newUser = {
        id: Date.now().toString(),
        email,
        name,
        passwordHash,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _ph, ...userWithoutHash } = newUser;
    return { token, user: userWithoutHash };
}
exports.registerUser = registerUser;
async function loginUser(email, passwordPlain) {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcryptjs_1.default.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _ph, ...userWithoutHash } = user;
    return { token, user: userWithoutHash };
}
exports.loginUser = loginUser;
//# sourceMappingURL=auth.service.js.map