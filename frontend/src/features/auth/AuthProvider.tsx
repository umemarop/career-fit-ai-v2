"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { clearAccessToken, setAccessToken } from "@/lib/auth-token";
import { authService } from "@/services/auth.service";
import type { AuthUser, LoginInput } from "@/types/auth.types";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAuthState: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    try {
      const refreshResult = await authService.refresh();

      setAccessToken(refreshResult.accessToken);

      const currentUser = await authService.getMe();

      setUser(currentUser);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (input: LoginInput) => {
    const result = await authService.login(input);

    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);
  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();

    setUser(currentUser);
  }, []);
  const clearAuthState = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
      clearAuthState,
    }),
    [user, isLoading, login, logout, refreshUser, clearAuthState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
