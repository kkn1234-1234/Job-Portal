// src/ap/api.js
import axios from "axios";

// hardcode temporarily to eliminate .env mistakes during debugging
const API_BASE = "http://localhost:9091/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("[API] ->", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API ERROR]", err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
