import { Router, Request } from 'express';
import { storage } from '../storage';

// Extend Express Request to include Replit user info
interface ReplitRequest extends Request {
  replit?: {
    user?: {
      id: number;
      username: string;
      displayName?: string;
      profileImage?: string;
    };
  };
}

const router = Router();

// GET /api/auth/me - Get current user
router.get('/me', async (req: ReplitRequest, res) => {
  try {
    if (req.replit && req.replit.user) {
      // User is authenticated via Replit
      const replitUser = req.replit.user;
      
      // Find or create user in our database
      let user = await storage.getUserByReplitId(replitUser.id.toString());
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: replitUser.username,
          password: null // Add null password for Replit users
        });
        
        // Note: replitId, isReplitUser, displayName, and profileImage need to be set separately
        // The insertUserSchema in schema.ts only allows username and password fields
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          profileImage: replitUser.profileImage || null,
          isReplitUser: true
        }
      });
    } else {
      res.json({ success: false, user: null });
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    res.status(500).json({ success: false, error: 'Authentication check failed' });
  }
});

// GET /api/auth/login - Redirect to Replit OAuth
router.get('/login', (req, res) => {
  const redirectUrl = req.query.redirect || '/';
  res.redirect(`/@${process.env.REPL_OWNER}/${process.env.REPL_SLUG}?authuser=1&redirect=${encodeURIComponent(redirectUrl as string)}`);
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  // Clear any local session data if needed
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;