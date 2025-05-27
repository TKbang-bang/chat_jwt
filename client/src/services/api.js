import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "./token.service.js";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/protected`,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["access-token"]?.split(" ")[1];
    if (newAccessToken) setAccessToken(newAccessToken);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const retryResponse = await api(originalRequest);
        return retryResponse;
      } catch (retryError) {
        if (window.location.pathname !== "/sign")
          window.location.href = "/sign";
        removeAccessToken();

        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
