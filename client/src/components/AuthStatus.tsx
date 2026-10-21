import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { User, LogIn, LogOut, UserCircle } from 'lucide-react';

interface AuthUser {
  id: number;
  username: string;
  displayName?: string;
  profileImage?: string;
  isReplitUser: boolean;
}

interface AuthStatusProps {
  onAuthChange?: (user: AuthUser | null) => void;
}

export default function AuthStatus({ onAuthChange }: AuthStatusProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        onAuthChange?.(data.user);
      } else {
        setUser(null);
        onAuthChange?.(null);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setUser(null);
      onAuthChange?.(null);
    } finally {
      setLoading(false);
    }
  }, [onAuthChange]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = () => {
    window.location.href = '/api/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      onAuthChange?.(null);
      window.location.reload();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
        <span className="text-sm">Checking authentication...</span>
      </div>
    );
  }

  if (user) {
    return (
      <Card className="p-4 bg-slate-800 border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.displayName || user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-slate-400" />
            )}
            <div>
              <p className="text-white font-medium">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-slate-400">
                {user.isReplitUser ? 'Replit User' : 'Local User'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-slate-800 border-slate-600">
      <div className="text-center">
        <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-300 mb-3">Sign in to save your progress</p>
        <Button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In with Replit
        </Button>
      </div>
    </Card>
  );
}