import { createContext, useContext, useState, useEffect } from "react";
import { setSession, getSession, removeSession } from "./session";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const storedUser = typeof window !== "undefined" ? getSession("user") : null;

  const [user, setUser] = useState(storedUser || null);

  useEffect(() => {
    try {
      if (user) {
        setSession("user", user);
        setSession("isAuthenticated", "true");
      } else {
        removeSession("user");
        setSession("isAuthenticated", "false");
        removeSession("token");
      }
    } catch (e) {
      // ignore sessionStorage errors
    }
  }, [user]);

  const login = (userObj) => setUser(userObj);
  const logout = () => {
    setUser(null);
    try {
      removeSession("user");
      removeSession("token");
      setSession("isAuthenticated", "false");
    } catch {}
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
