import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  const payload = verifyToken<JwtPayload>(token);
  if (!payload) return res.status(401).json({ message: 'Invalid token' });

  req.user = payload;
  return next();
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
};
