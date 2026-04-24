/**
 * axiosInstance.js — Pre-configured Axios for the Django API
 *
 * Features:
 * - Base URL from environment variable
 * - Automatically attaches JWT Bearer token to every request
 * - Auto-refreshes expired access tokens (30-min lifetime) via refresh token
 * - Queues concurrent requests that arrive during a token refresh
 * - Redirects to /login only when the refresh token itself has expired
 */

import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, logout } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ── Token refresh state ───────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

/**
 * Process all queued requests after a refresh attempt.
 * @param {Error|null} error  - Pass an error to reject all queued promises.
 * @param {string|null} token - Pass the new token to resolve all queued promises.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── Request interceptor: attach access token ──────────────────
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

// ── Response interceptor: auto-refresh on 401 ─────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for login/refresh endpoints themselves,
    // or if this request has already been retried once.
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login/') ||
      originalRequest?.url?.includes('/auth/token/refresh/');

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      // If a refresh is already in progress, queue this request.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark this request as retried and start a refresh.
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token stored — force logout.
        isRefreshing = false;
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      try {
        // Call Django SimpleJWT refresh endpoint directly (no interceptor loop).
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = data.access;
        // If rotation is enabled Django also returns a new refresh token.
        const newRefresh = data.refresh || refreshToken;

        setTokens(newAccess, newRefresh);

        // Update the Authorization header and retry the original request.
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token expired/blacklisted) — log the user out.
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;