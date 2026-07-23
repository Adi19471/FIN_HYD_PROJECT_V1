import axios from "axios";
import { API_BASE } from "lib/config";
import {
  getAuthorizationHeader,
  setAuthToken,
  getRefreshToken,
  setRefreshToken,
} from "src/utils/authToken";
import { removeSession, setSession } from "src/utils/session";

axios.interceptors.request.use((config) => {
  const authorization = getAuthorizationHeader();

  if (authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = authorization;
  }

  return config;
});

// Requests to these endpoints must never trigger another refresh attempt
// (that would loop) and are never themselves eligible for silent retry.
const AUTH_EXEMPT_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];
const isAuthExempt = (url) => AUTH_EXEMPT_PATHS.some((path) => (url || "").includes(path));

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newToken) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${newToken}`;
    resolve(axios(config));
  });
  pendingQueue = [];
};

const redirectToLogin = () => {
  removeSession("user");
  removeSession("token");
  removeSession("refreshToken");
  setSession("isAuthenticated", "false");
  removeSession("lastActivity");
  window.location.href = "/login";
};

// Uses fetch, NOT the shared axios instance: the request interceptor above
// would attach the still-expired/invalid access token to this call too, and
// JwtFilter runs before Spring Security's permitAll() check on /auth/**, so
// it would 401 this call before it ever reached the refresh endpoint.
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const resp = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!resp.ok) {
    throw new Error("Refresh token request failed");
  }

  const data = await resp.json();
  setAuthToken(data.token);
  setRefreshToken(data.refreshToken);
  return data.token;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || !config || isAuthExempt(config.url)) {
      return Promise.reject(error);
    }

    if (config._retry) {
      // Already went through one refresh-and-retry cycle and failed again.
      redirectToLogin();
      return Promise.reject(error);
    }
    config._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight -- queue behind it instead of firing
      // a parallel /auth/refresh call.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config });
      });
    }

    isRefreshing = true;

    return refreshAccessToken()
      .then((newToken) => {
        processQueue(null, newToken);
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
        return axios(config);
      })
      .catch((refreshError) => {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(error);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }
);
