import { createContext, useState, useEffect } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  loginWithProvider as providerRequest,
  completeProviderLogin as completeProviderRequest,
} from "../api/auth";

export const AuthContext = createContext(null);

const USER_KEY = "tridi_user";
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

  const login = async ({ email, password }) => {
    const { token, user } = await loginRequest(email, password);
    if (!token || !user) throw new Error("Credenciales inválidas.");
    persist(token, user);
    return user;
  };

  const register = async (form) => {
    const { token, user } = await registerRequest(form);
    if (!token) throw new Error("El usuario ya existe.");
    persist(token, user);
    return user;
  };

  const loginWithProvider = async (serviceName) => {
    await providerRequest(serviceName);
  };

  const completeProviderLogin = async ({ token: providerToken }) => {
    const { token, user } = await completeProviderRequest(providerToken);
    if (!token || !user) throw new Error("No se pudo completar el login.");
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
    loginWithProvider,
    completeProviderLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}