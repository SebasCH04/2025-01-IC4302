import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, validateUser } from '../services/user';

dotenv.config();
const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan campos' });

  try {
    const id = await createUser(username, password);
    return res.status(201).json({ message: 'Usuario creado', userId: id });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await validateUser(username, password);

  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, { expiresIn: '2h' });
  return res.json({ token });
});

export default router;
