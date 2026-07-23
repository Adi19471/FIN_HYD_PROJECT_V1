import { useState, useEffect, useCallback } from "react";
import { setSession, getSession, removeSession } from "./session";
import { AuthContext } from "src/utils/authStore";
import { normalizePermissionCodes, normalizeRoles } from "src/utils/permissions";
import { getRefreshToken } from "src/utils/authToken";
import { API_BASE } from "lib/config";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes

export function AuthProvider({ children }) {
  const storedUser = typeof window !== "undefined" ? getSession("user") : null;
  const storedToken = typeof window !== "undefined" ? getSession("token") : null;
  const storedName = typeof window !== "undefined" ? getSession("username") : null;

  const normalizeUser = useCallback((userObj) => {
    if (!userObj) return null;

    return {
      ...userObj,
      name: userObj.name || userObj.username || storedName || "User",
      token: userObj.token || storedToken || "",
      roles: normalizeRoles(userObj),
      permissions: normalizePermissionCodes(userObj),
    };
  }, [storedName, storedToken]);

  const [user, setUser] = useState(normalizeUser(storedUser || (storedToken ? { name: storedName || "User", token: storedToken } : null)));

  const logout = useCallback(() => {
    setUser(null);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Best-effort: revoke the refresh token server-side. Doesn't block
        // clearing local state or the redirect below either way.
        fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }).catch(() => {});
      }
    } catch {}
    try {
      removeSession("user");
      removeSession("token");
      removeSession("refreshToken");
      setSession("isAuthenticated", "false");
      removeSession("lastActivity");
    } catch {}
    // Redirect to login
    window.location.href = "/login";
  }, []);

  const updateActivity = useCallback(() => {
    try {
      setSession("lastActivity", Date.now().toString());
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (user) {
        setSession("user", user);
        setSession("isAuthenticated", "true");
        updateActivity();
      } else {
        removeSession("user");
        setSession("isAuthenticated", "false");
        removeSession("token");
        removeSession("refreshToken");
        removeSession("lastActivity");
      }
    } catch (e) {
      // ignore sessionStorage errors
    }
  }, [user, updateActivity]);

  useEffect(() => {
    if (!user) return;

    // Set up activity listeners
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => updateActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Check for inactivity every minute
    const checkInactivity = () => {
      try {
        const lastActivity = parseInt(getSession("lastActivity") || "0");
        if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
          logout();
        }
      } catch {}
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [user, updateActivity, logout]);

  const login = (userObj) => setUser(normalizeUser(userObj));

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
