import { create } from 'zustand';
import { User, LoginCredentials } from '../types';
import { TokenManager } from '../utils/tokenManager';
import { apiClient } from '../services/apiClientV2';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await apiClient.login(credentials.username, credentials.password);
      
      if (!success) {
        throw new Error('Invalid credentials');
      }
      
      // Fetch user data after successful login
      try {
        const userData = await apiClient.get<{ user: User }>('/auth/me');
        
        set({ 
          user: userData.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch (userError: any) {
        // Even if we can't get user data, we're still authenticated
        set({ 
          isAuthenticated: true, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const isAuth = await apiClient.isAuthenticated();
      
      if (isAuth) {
        // Optionally fetch user data if authenticated
        try {
          const userData = await apiClient.get<{ user: User }>('/auth/me');
          set({ user: userData.user, isAuthenticated: true, isLoading: false });
        } catch (userError) {
          // If we can't get user data but have valid token, still set authenticated
          set({ isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      // If authentication check fails, set not authenticated
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  }
}));