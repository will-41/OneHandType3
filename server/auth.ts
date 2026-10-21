import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      name: string;
      profileImage?: string;
      replit?: {
        id: number;
        username: string;
      };
    };
  }
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      loginUrl: '/auth/login'
    });
  }
  next();
}

// Middleware to optionally check auth (user can be null)
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // User is already attached by replit-auth middleware
  next();
}

// Get current user info
export function getCurrentUser(req: Request) {
  return req.user || null;
}