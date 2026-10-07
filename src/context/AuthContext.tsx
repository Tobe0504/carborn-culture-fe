import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, TOKEN_KEY } from "@/lib/api";
import type { Admin } from "@/types";

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const hasToken = () => {
  try {
    return Boolean(window.localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(hasToken);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
    }
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!hasToken()) return;
    api
      .me()
      .then(setAdmin)
      .catch(logout)
      .finally(() => setIsLoading(false));
  }, [logout]);

  useEffect(() => {
    window.addEventListener("carbon-culture:unauthorized", logout);
    return () => window.removeEventListener("carbon-culture:unauthorized", logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    window.localStorage.setItem(TOKEN_KEY, result.token);
    setAdmin(result.admin);
  }, []);

  const value = useMemo(() => ({ admin, isLoading, login, logout }), [admin, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
