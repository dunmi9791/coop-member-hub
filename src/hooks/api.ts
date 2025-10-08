import axios, { AxiosInstance } from "axios";
import { env } from "process";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add interceptor (optional: for attaching token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 unauthorized
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirect to login");
    }
    return Promise.reject(error);
  }
);

export default api;