/**
 * TokenManager - Handles JWT token storage and validation
 * 
 * This utility manages JWT authentication tokens with the following security approach:
 * - Access tokens are stored in memory only (not in localStorage/sessionStorage)
 * - Refresh tokens are stored in localStorage for persistence across sessions
 */

const REFRESH_TOKEN_KEY = 'refresh_token';

// In-memory storage for access token
let accessToken: string | null = null;

export const TokenManager = {
  /**
   * Get the current access token from memory
   */
  getAccessToken: (): string | null => {
    return accessToken;
  },

  /**
   * Set the access token in memory
   */
  setAccessToken: (token: string): void => {
    accessToken = token;
  },

  /**
   * Get the refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Set the refresh token in localStorage
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Clear all tokens (both access and refresh)
   */
  clearTokens: (): void => {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if we have a valid session (access token exists)
   */
  hasValidSession: (): boolean => {
    return !!accessToken || !!localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Check if we have a refresh token available
   */
  hasRefreshToken: (): boolean => {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Check if a JWT token is expired
 * @param token JWT token to check
 * @returns boolean indicating if the token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Add a small buffer (30 seconds) to account for clock differences
    return payload.exp * 1000 < (Date.now() + 30000);
  } catch {
    return true;
  }
};