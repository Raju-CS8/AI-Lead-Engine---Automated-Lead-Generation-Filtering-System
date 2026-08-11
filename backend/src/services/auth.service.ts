import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const DB_PATH = path.join(__dirname, '../../users.json');

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function loadUsers(): User[] {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]), 'utf-8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    return [];
  }
}

function saveUsers(users: User[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export async function registerUser(email: string, name: string, passwordPlain: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordPlain, salt);

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, env.JWT_SECRET, { expiresIn: '7d' });
  
  const { passwordHash: _ph, ...userWithoutHash } = newUser;
  return { token, user: userWithoutHash };
}

export async function loginUser(email: string, passwordPlain: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '7d' });
  
  const { passwordHash: _ph, ...userWithoutHash } = user;
  return { token, user: userWithoutHash };
}
