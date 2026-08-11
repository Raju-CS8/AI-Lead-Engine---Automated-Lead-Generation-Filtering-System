import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api.service';

interface AuthUser { email: string; name: string }
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, passwordPlain: string) => Promise<void>;
  register: (email: string, name: string, passwordPlain: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'ai_lead_auth';
const TOKEN_KEY = 'ai_lead_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) as AuthUser : null; }
    catch { return null; }
  });

  useEffect(() => {
    user ? localStorage.setItem(STORAGE_KEY, JSON.stringify(user)) : localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback(async (email: string, passwordPlain: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password: passwordPlain });
    if (data.success && data.data) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      setUser(data.data.user);
    } else {
      throw new Error('Login failed');
    }
  }, []);

  const register = useCallback(async (email: string, name: string, passwordPlain: string) => {
    const { data } = await apiClient.post('/auth/register', { email, name, password: passwordPlain });
    if (data.success && data.data) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      setUser(data.data.user);
    } else {
      throw new Error('Registration failed');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}