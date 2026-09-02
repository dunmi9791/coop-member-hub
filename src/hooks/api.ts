import axios, { AxiosInstance } from "axios";


const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 30000,
   headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
 });

api.interceptors.request.use(
  (config) => {
    // Get session info from sessionStorage
    const sessionInfo = sessionStorage.getItem("session_info");
    if (sessionInfo) {
      try {
        const parsedSession = JSON.parse(sessionInfo);
        // Add session ID to headers if available
        if (parsedSession?.session_id) {
          config.headers['X-Session-ID'] = parsedSession.session_id;
        }
        // Add user ID for Odoo context
        if (parsedSession?.uid) {
          config.headers['X-User-ID'] = parsedSession.uid;
        }
        // Add database context
        if (parsedSession?.db) {
          config.headers['X-Database'] = parsedSession.db;
        }
      } catch (error) {
        console.warn('Failed to parse session info:', error);
      }
    }
    
    // Always enable credentials for session-based auth
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Odoo sometimes returns "Session Expired" as a 200 OK with an error object
    if (response.data?.error?.data?.name === "odoo.http.SessionExpiredException" || 
        response.data?.error?.message === "Odoo Session Expired") {
      console.error("Odoo Session Expired, redirecting to login");
      handleUnauthorized();
    }
    return response;
  },
  (error) => {
    // Handle global errors like 401 unauthorized
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirect to login");
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

function handleUnauthorized() {
  // Clear all session data
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("session_info");
  
  // Use window.location.href to force a full reload and redirect to login
  // This ensures all application state is cleared
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
}

export default api;