import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface AuthUser { email: string; name: string }
interface AuthContextValue { user: AuthUser | null; isAuthenticated: boolean; login: (e: string, n: string) => void; logout: () => void }

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'ai_lead_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) as AuthUser : null; }
    catch { return null; }
  });

  useEffect(() => {
    user ? localStorage.setItem(STORAGE_KEY, JSON.stringify(user)) : localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = useCallback((email: string, name: string) => setUser({ email, name }), []);
  const logout = useCallback(() => setUser(null), []);

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}