import { createContext, useState, useEffect } from "react";
import { login as loginRequest, register as registerRequest } from "../api/auth";

export const AuthContext = createContext(null);

const USER_KEY  = "tridi_user";
const TOKEN_KEY = "tridi_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  const login = async ({ username, password }) => {
    const { token, user } = await loginRequest(username, password);
    if (!token || !user) throw new Error("Credenciales inválidas.");
    persist(token, user);
    return user;
  };

  const register = async ({ username, password }) => {
    const { token, user } = await registerRequest(username, password);
    if (!token) throw new Error("El usuario ya existe.");
    persist(token, user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}