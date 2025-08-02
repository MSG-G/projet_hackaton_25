import { Router } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signAccessToken, signRefreshToken, verifyToken, JwtPayload } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';

const prisma = new PrismaClient();
export const authRouter = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).optional()
});

// Register (optional for admin seeding – can be disabled in prod)
authRouter.post('/register', async (req, res) => {
  const parse = credsSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { email, password, role } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash: hashed, role: (role as UserRole) ?? UserRole.contractor }
  });
  
  const payload: JwtPayload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
  return res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
});

// Login
authRouter.post('/login', async (req, res) => {
  const parse = credsSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { email, password, role } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const payload: JwtPayload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
  return res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
});

// Refresh token
authRouter.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) return res.status(401).json({ message: 'Invalid refresh token' });

  const payload = verifyToken<JwtPayload>(refreshToken);
  if (!payload) return res.status(401).json({ message: 'Invalid refresh token' });

  const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });
  return res.json({ accessToken });
});

// Logout
authRouter.post('/logout', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  return res.json({ message: 'Logged out' });
});

// Protected route example
authRouter.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: (req as any).user.userId }, select: { id: true, email: true, role: true } });
  return res.json({ user });
});
