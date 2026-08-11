import { Router } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }
    const result = await registerUser(email, name, password);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    if (err.message === 'User already exists') {
      res.status(409).json({ success: false, error: err.message });
    } else {
      next(err);
    }
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }
    const result = await loginUser(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    if (err.message === 'Invalid email or password') {
      res.status(401).json({ success: false, error: err.message });
    } else {
      next(err);
    }
  }
});
