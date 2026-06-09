import axios from "axios";
import { getAuthorizationHeader } from "src/utils/authToken";

axios.interceptors.request.use((config) => {
  const authorization = getAuthorizationHeader();

  if (authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = authorization;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized API response", error.config?.url);
    }

    return Promise.reject(error);
  }
);
