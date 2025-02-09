import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  user?: any; // Extend request type to include user
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');
  
  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
