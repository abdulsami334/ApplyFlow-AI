"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearStoredSession, getStoredSession, setStoredSession } from "@/lib/storage";
import * as authService from "@/services/auth.service";
import { getCurrentUser } from "@/services/users.service";
import type { AuthSession, LoginRequest, RegisterRequest, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextSession: AuthSession) => {
    setStoredSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await getCurrentUser();

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const nextSession = { ...currentSession, user };
      setStoredSession(nextSession);
      return nextSession;
    });
  }, []);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    setSession(storedSession);
    getCurrentUser()
      .then((user) => {
        const refreshedSession = { ...storedSession, user };
        setStoredSession(refreshedSession);
        setSession(refreshedSession);
      })
      .catch(() => {
        clearStoredSession();
        setSession(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login: async (payload) => {
        const nextSession = await authService.login(payload);
        persistSession(nextSession);
      },
      register: async (payload) => {
        const nextSession = await authService.register(payload);
        persistSession(nextSession);
      },
      logout,
      refreshUser,
    }),
    [isLoading, logout, persistSession, refreshUser, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
