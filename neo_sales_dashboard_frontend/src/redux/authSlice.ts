import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginCredentials } from '../types';
import { apiClient } from '../services/apiClientV2';
import { TokenManager } from '../utils/tokenManager';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const success = await apiClient.login(credentials.username, credentials.password);
      
      if (!success) {
        throw new Error('Invalid credentials');
      }
      
      // Fetch user data after successful login
      try {
        const userData = await apiClient.get<{ user: User }>('/auth/me');
        return userData.user;
      } catch (userError: any) {
        // Even if we can't get user data, we're still authenticated
        return null;
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await apiClient.logout();
    return null;
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const isAuth = await apiClient.isAuthenticated();
      
      if (isAuth) {
        // Optionally fetch user data if authenticated
        try {
          const userData = await apiClient.get<{ user: User }>('/auth/me');
          return userData.user;
        } catch (userError) {
          // If we can't get user data but have valid token, still return authenticated
          return null;
        }
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;