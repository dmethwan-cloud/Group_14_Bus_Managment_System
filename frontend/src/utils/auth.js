/**
 * auth.js — JWT Token & User Role Utilities
 * All token operations go through these helpers.
 * Tokens are stored in localStorage.
 */

const ACCESS_TOKEN_KEY  = 'bus_access_token';
const REFRESH_TOKEN_KEY = 'bus_refresh_token';
const USER_KEY          = 'bus_user';

// ── Token management ───────────────────────────────────────

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ── User data ──────────────────────────────────────────────

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// ── Auth state ─────────────────────────────────────────────

export const isAuthenticated = () => {
  return !!getAccessToken();
};

// ── Logout ─────────────────────────────────────────────────

export const logout = () => {
  removeTokens();
  window.location.href = '/login';
};

// ── Role-based redirect ────────────────────────────────────

export const getDashboardPath = (role) => {
  const paths = {
    admin:     '/admin/dashboard',
    operator:  '/operator/dashboard',
    conductor: '/conductor/dashboard',
    passenger: '/passenger/dashboard',
  };
  return paths[role] || '/login';
};
