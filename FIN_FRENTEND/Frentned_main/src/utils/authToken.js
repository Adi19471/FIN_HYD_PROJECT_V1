import { getSession, setSession, removeSession } from "src/utils/session";

export const normalizeToken = (value) => {
  if (!value) return "";

  const rawToken =
    typeof value === "string"
      ? value
      : value.token || value.accessToken || value.jwt || "";

  return String(rawToken)
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
};

export const getAuthToken = () => normalizeToken(getSession("token"));

export const setAuthToken = (token) => {
  const normalizedToken = normalizeToken(token);
  setSession("token", normalizedToken);
  return normalizedToken;
};

export const getAuthorizationHeader = () => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : "";
};

// Refresh tokens are opaque UUIDs, not JWTs, so they get their own light
// normalizer rather than reusing normalizeToken's JWT/Bearer-shaped logic.
const normalizeRefreshToken = (value) => {
  if (!value) return "";
  const raw = typeof value === "string" ? value : value.refreshToken || "";
  return String(raw).trim().replace(/^"+|"+$/g, "");
};

export const getRefreshToken = () => normalizeRefreshToken(getSession("refreshToken"));

export const setRefreshToken = (refreshToken) => {
  const normalized = normalizeRefreshToken(refreshToken);
  setSession("refreshToken", normalized);
  return normalized;
};

export const clearAuthTokens = () => {
  removeSession("token");
  removeSession("refreshToken");
};
