import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ─────────────────────────────────────────────
// Extend Express Request type to include user
// ─────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ─────────────────────────────────────────────
// JWT Helpers
// ─────────────────────────────────────────────

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is required');
  return secret;
};

export const signToken = (payload: AuthUser): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role } as jwt.JwtPayload,
    getJwtSecret(),
    { expiresIn: expiresIn as any }
  );
};

// ─────────────────────────────────────────────
// requireAuth — verify JWT Bearer token
// ─────────────────────────────────────────────
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUser;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ─────────────────────────────────────────────
// requireRole — check user role against whitelist
// Usage: requireRole('ADMIN', 'HR')
// ─────────────────────────────────────────────
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
