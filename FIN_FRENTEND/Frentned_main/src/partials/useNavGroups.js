import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess, PATH_PERMISSION_CODES } from "src/utils/permissions";
import { sidebarGroups } from "./SidebarConfig";

// A group's match entry ending in "/" is a section prefix ("/loans/" owns
// /Loans/Maturity); one without is a standalone page ("/loan" owns only /Loan).
// Without that distinction "/loan" would also swallow every /Loans/* route.
const matchesGroupPath = (pathname, path) =>
  path.endsWith("/") ? pathname.startsWith(path) : pathname === path;

/**
 * The menu as the signed-in user may see it, and where they are in it. The
 * sidebar and the horizontal menu (Settings > Layout) both draw from this, so
 * the two can never disagree about what a user is allowed to open.
 */
export default function useNavGroups() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pathnameLower = pathname.toLowerCase();

  const visibleGroups = useMemo(
    () =>
      sidebarGroups
        .filter((group) => group.key !== "auth")
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermissionAccess(user, PATH_PERMISSION_CODES[item.path])),
        }))
        .filter((group) => group.items.length > 0),
    [user]
  );

  const canViewDashboard = hasPermissionAccess(user, PATH_PERMISSION_CODES["/"]);

  const activeGroup = useMemo(
    () => visibleGroups.find((group) => group.match.some((path) => matchesGroupPath(pathnameLower, path))),
    [pathnameLower, visibleGroups]
  );

  return { pathname, visibleGroups, activeGroup, canViewDashboard };
}
