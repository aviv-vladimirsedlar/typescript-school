import axios from "axios";

import { logoutSuccess } from "../features/auth/auth.slice";

import { config } from "./api-config";
import store from "./store";

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

// Response interceptor to handle 401 errors and token saving
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logoutSuccess());
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
