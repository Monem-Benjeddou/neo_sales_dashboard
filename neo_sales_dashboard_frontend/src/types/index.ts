export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}