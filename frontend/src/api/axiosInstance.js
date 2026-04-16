/**
 * axiosInstance.js — Pre-configured Axios for the Django API
 *
 * Features:
 * - Base URL from environment variable
 * - Automatically attaches JWT Bearer token to every request
 * - Redirects to /login on 401 Unauthorized
 */

import axios from 'axios';
import { getAccessToken, logout } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// ── Request interceptor: attach token ─────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ─────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, normally we log out.
    // However, we MUST bypass this if the user is actively trying to log in,
    // otherwise a failed login (e.g. pending approval) will delete other valid sessions in localStorage.
    const isLoginEndpoint = error.config && error.config.url && error.config.url.includes('/auth/login/');
    
    if (error.response?.status === 401 && !isLoginEndpoint) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
