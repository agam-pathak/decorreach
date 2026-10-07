'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, companyName?: string) => Promise<boolean>;
  loginAsDemo: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_DEFAULT_USER: User = {
  id: 'usr_demo',
  email: 'agam@decorreach.com',
  name: 'Agam Pathak',
  companyName: 'Heritage Decor Exporters',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const savedUser = localStorage.getItem('decorreach_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default to demo user for seamless out-of-the-box exploration
        setUser(DEMO_DEFAULT_USER);
        localStorage.setItem('decorreach_auth_user', JSON.stringify(DEMO_DEFAULT_USER));
      }
    } catch {
      setUser(DEMO_DEFAULT_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password = 'password123'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('decorreach_auth_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password = 'password123', companyName = 'Home Decor'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('decorreach_auth_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const loginAsDemo = async () => {
    setUser(DEMO_DEFAULT_USER);
    localStorage.setItem('decorreach_auth_user', JSON.stringify(DEMO_DEFAULT_USER));
  };

  const loginWithGoogle = async () => {
    // Simulates or initiates Google OAuth flow
    const googleUser: User = {
      id: `usr_google_${Date.now()}`,
      email: 'agam.google@decorreach.com',
      name: 'Agam (Google Verified)',
      companyName: 'Artisan Decor Global',
      createdAt: new Date().toISOString(),
    };
    setUser(googleUser);
    localStorage.setItem('decorreach_auth_user', JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('decorreach_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginAsDemo,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
