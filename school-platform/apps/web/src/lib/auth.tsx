'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
  id: string;
  schoolId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      const decoded = decodeToken(saved);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(saved);
        setUser({
          id: decoded.sub,
          schoolId: decoded.schoolId,
          email: decoded.email,
          firstName: decoded.firstName || '',
          lastName: decoded.lastName || '',
          roles: decoded.roles || [],
          permissions: decoded.permissions || [],
        });
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('token', res.accessToken);
    const decoded = decodeToken(res.accessToken);
    setToken(res.accessToken);
    setUser({
      id: decoded.sub,
      schoolId: decoded.schoolId,
      email: res.user.email,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (resource: string, action: string) => {
    if (!user) return false;
    if (user.roles.includes('owner')) return true;
    return user.permissions.includes(`${resource}:${action}`);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}