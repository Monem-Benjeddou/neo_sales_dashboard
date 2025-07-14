import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: any;
  tokens: AuthTokens;
}

class ApiClient {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string = 'http://localhost:8000/api') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokens();
  }

  private loadTokens(): void {
    // Load refresh token from localStorage
    this.refreshToken = localStorage.getItem('refresh_token');
    // Access token is only stored in memory
  }

  private saveTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    
    // Only store refresh token in localStorage
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('refresh_token');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ accessToken: string }>(
        `${this.api.defaults.baseURL}/token/refresh/`,
        { refresh: this.refreshToken }
      );
      
      this.accessToken = response.data.accessToken;
      return this.accessToken;
    } catch (error) {
      this.clearTokens();
      throw new Error('Failed to refresh token');
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // If we have an access token and it's not expired, use it
        if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        
        // If we have a refresh token, try to get a new access token
        if (this.refreshToken) {
          try {
            // Use a promise queue to prevent multiple refresh requests
            if (!this.refreshPromise) {
              this.refreshPromise = this.refreshAccessToken();
            }
            
            const newAccessToken = await this.refreshPromise;
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Reset the refresh promise after completion
            this.refreshPromise = null;
            return config;
          } catch (error) {
            // If refresh fails, clear tokens and redirect to login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle specific error cases
        if (error.response) {
          // Handle unauthorized errors that aren't from the token refresh endpoint
          const isRefreshRequest = error.config.url.includes('/token/refresh/');
          
          if (error.response.status === 401 && !isRefreshRequest) {
            // Clear tokens and redirect to login
            this.clearTokens();
            window.location.href = '/login';
          }
          
          // Add more specific error handling as needed
          const errorMessage = error.response.data?.message || 'An error occurred';
          error.message = `${error.response.status}: ${errorMessage}`;
        } else if (error.request) {
          // Request was made but no response received
          error.message = 'Network error: No response received from server';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  public async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.api.post<LoginResponse>('/token/', { username, password });
      this.saveTokens(response.data.tokens);
      return true;
    } catch (error) {
      return false;
    }
  }

  public logout(): void {
    this.clearTokens();
    // Optionally call logout endpoint if the API requires it
    this.api.post('/auth/logout').catch(() => {});
  }

  // Generic request methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

// Export as singleton instance
export const apiClient = new ApiClient();