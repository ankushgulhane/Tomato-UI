import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import type { Role } from '../types/dto';

const STORAGE_KEY = 'tomato.token';

interface DecodedToken {
  sub: string;
  userId: number;
  role: Role;
  exp: number;
}

interface AuthState {
  token: string | null;
  userId: number | null;
  role: Role | null;
  email: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const EMPTY_STATE: AuthState = { token: null, userId: null, role: null, email: null };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeToken(token: string): AuthState | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 <= Date.now()) return null;
    return { token, userId: decoded.userId, role: decoded.role, email: decoded.sub };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(EMPTY_STATE);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const decoded = decodeToken(stored);
      if (decoded) {
        setAuthToken(stored);
        setState(decoded);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setState(EMPTY_STATE);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded) return;
    localStorage.setItem(STORAGE_KEY, token);
    setAuthToken(token);
    setState(decoded);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setState(EMPTY_STATE);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, isAuthenticated: !!state.token, isInitializing, login, logout }),
    [state, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
}
