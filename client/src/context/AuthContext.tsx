import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "../api/client";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  verify: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Validate token by making a lightweight API call
      api.get("/expense-types")
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("auth_token");
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleLogout = () => setIsAuthenticated(false);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const verify = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/verify", { pin });
      const { token } = res.data;
      localStorage.setItem("auth_token", token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
