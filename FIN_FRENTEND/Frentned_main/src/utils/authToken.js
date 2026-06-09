import { getSession, setSession } from "src/utils/session";

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
