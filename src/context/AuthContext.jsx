import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tridi_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("tridi_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const fakeUser = { email, name: email.split("@")[0] };
    localStorage.setItem("tridi_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  };

  const register = async ({ firstName, lastName, email, password }) => {
    const fakeUser = { email, name: `${firstName} ${lastName}` };
    localStorage.setItem("tridi_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  };

  const logout = () => {
    localStorage.removeItem("tridi_user");
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