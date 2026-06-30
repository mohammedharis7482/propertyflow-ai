"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAccessToken, getRefreshToken } from "@/lib/auth-token";
import {
  AuthUser,
  getFriendlyAuthError,
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  RegisterPayload,
} from "@/services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch (error) {
      console.error(getFriendlyAuthError(error));
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function hydrateUser() {
      await Promise.resolve();

      if (!active) {
        return;
      }

      await refreshUser();
    }

    hydrateUser();

    return () => {
      active = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest(email, password);
    const me = await getMe();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    const payload = await registerRequest(data);
    setUser(null);
    return payload.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest(getRefreshToken());
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
