import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Timezone": timezone,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const setAuthToken = (accessToken: string, refreshToken: string) => {
  if (accessToken) {
    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
    apiClient.defaults.headers.common["x-refresh-token"] = refreshToken;
    sessionStorage.setItem(ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
