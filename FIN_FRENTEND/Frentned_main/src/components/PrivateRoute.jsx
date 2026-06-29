import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/authStore";
import { hasPermissionAccess, normalizeRoles } from "src/utils/permissions";

export default function PrivateRoute({ children, allowedRoles, requiredPermissions }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && Array.isArray(allowedRoles) && user) {
    const userRoles = normalizeRoles(user);
    const legacyRole = user.role ? String(user.role).toUpperCase() : "";
    const isAllowed = allowedRoles.some((role) => {
      const normalizedRole = String(role).trim().toUpperCase();
      return userRoles.includes(normalizedRole) || userRoles.includes(`ROLE_${normalizedRole}`) || legacyRole === normalizedRole;
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (!hasPermissionAccess(user, requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
