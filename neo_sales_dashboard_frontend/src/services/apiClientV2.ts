import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenManager, isTokenExpired } from '../utils/tokenManager';
import { TokenResponse, ApiError } from '../types';

/**
 * Comprehensive API client for React applications
 * Features:
 * - JWT authentication with access and refresh tokens
 * - Secure token storage (access token in memory, refresh token in localStorage)
 * - Automatic token refresh
 * - Centralized error handling
 * - Generic request methods
 */
class ApiClient {
  private api: AxiosInstance;
  private refreshingPromise: Promise<string> | null = null;
  private requestQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor(baseURL: string = 'http://localhost:8000/api') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure axios interceptors for authentication and error handling
   */
  private setupInterceptors(): void {
    // Request interceptor - adds auth token to requests
    this.api.interceptors.request.use(
      async (config) => {
        const accessToken = TokenManager.getAccessToken();
        
        // If we have a valid access token, add it to the request
        if (accessToken && !isTokenExpired(accessToken)) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        }
        
        // If token is expired or missing but we have a refresh token, try to refresh
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            // Wait for token refresh or initiate a new refresh
            const newToken = await this.refreshAccessTokenWithQueue();
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          } catch (error) {
            // If refresh fails, clear tokens and reject
            TokenManager.clearTokens();
            return Promise.reject(error);
          }
        }
        
        // No tokens available, proceed without authentication
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handles errors and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors (except from token endpoints)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/token/') // Avoid infinite loops on token endpoints
        ) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const newToken = await this.refreshAccessTokenWithQueue();
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }
        
        // Format error for consistent handling
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Refresh the access token using the refresh token
   * Uses a queue system to prevent multiple concurrent refresh requests
   */
  private async refreshAccessTokenWithQueue(): Promise<string> {
    // If already refreshing, wait for that promise to resolve
    if (this.refreshingPromise) {
      return this.refreshingPromise;
    }
    
    // Start a new refresh process
    this.refreshingPromise = this.refreshAccessToken();
    
    try {
      // Wait for the refresh to complete
      const newToken = await this.refreshingPromise;
      
      // Process any queued requests
      this.processQueue(null, newToken);
      
      return newToken;
    } catch (error) {
      // If refresh fails, reject all queued requests
      this.processQueue(error, null);
      throw error;
    } finally {
      // Reset the refreshing promise
      this.refreshingPromise = null;
    }
  }

  /**
   * Process the queue of requests that were waiting for token refresh
   */
  private processQueue(error: any, token: string | null): void {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(this.api(config));
      }
    });
    
    // Clear the queue
    this.requestQueue = [];
  }

  /**
   * Perform the actual token refresh API call
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Call the token refresh endpoint
      const response = await axios.post<TokenResponse>(
        `${this.api.defaults.baseURL}/token/refresh/`,
        { refresh: refreshToken }
      );
      
      // Store the new access token
      const newAccessToken = response.data.access;
      TokenManager.setAccessToken(newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Format error responses for consistent handling
   */
  private formatError(error: any): ApiError {
    if (error.response) {
      // Server responded with an error status
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message || 'Server error',
        errors: error.response.data?.errors
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error: No response received from server'
      };
    } else {
      // Something happened in setting up the request
      return {
        status: 0,
        message: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Handle authentication failures (redirect to login)
   */
  private handleAuthFailure(): void {
    TokenManager.clearTokens();
    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Login with email and password
   * @returns Promise resolving to success/failure
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.api.post<TokenResponse>('/token/', {
        username,
        password
      });
      
      // Store the tokens
      TokenManager.setAccessToken(response.data.access);
      TokenManager.setRefreshToken(response.data.refresh);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout the user
   */
  public logout(): void {
    // Optionally call logout endpoint if the API requires it
    this.api.post('/auth/logout').catch(() => {});
    
    // Clear tokens
    TokenManager.clearTokens();
  }

  /**
   * Check if the user is authenticated
   * If access token is missing but refresh token exists, attempts to refresh
   */
  public async isAuthenticated(): Promise<boolean> {
    const accessToken = TokenManager.getAccessToken();
    
    // If we have a valid access token, we're authenticated
    if (accessToken && !isTokenExpired(accessToken)) {
      return true;
    }
    
    // If we have a refresh token, try to refresh the access token
    if (TokenManager.hasRefreshToken()) {
      try {
        await this.refreshAccessTokenWithQueue();
        return true;
      } catch (error) {
        // If refresh fails, we're not authenticated
        return false;
      }
    }
    
    // No valid tokens, not authenticated
    return false;
  }

  /**
   * Generic GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

// Export as singleton instance
export const apiClient = new ApiClient();