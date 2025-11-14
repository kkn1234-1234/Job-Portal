import axios from "axios";

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9091/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 
    "Content-Type": "application/json" 
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[API Request]", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("[API Response Error]", error?.response?.status, error?.response?.data);
    
    // Handle specific error cases
    if (error?.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
