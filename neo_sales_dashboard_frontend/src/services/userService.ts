// src/services/userService.ts

import { apiClient } from '../services/apiClientV2';
import { UserProfile, CreateUserRequest, UpdateUserRequest } from '../types/api';

class UserService {
  public async getAllUsers(): Promise<UserProfile[] | null> {
    try {
      const data = await apiClient.get<UserProfile[]>('/users/');
      return data;
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      return null;
    }
  }

  public async createUser(userData: CreateUserRequest): Promise<UserProfile | null> {
    try {
      const data = await apiClient.post<UserProfile>('/users/', userData);
      return data;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  public async getUserById(id: number): Promise<UserProfile | null> {
    try {
      const data = await apiClient.get<UserProfile>(`/users/${id}/`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch user with ID ${id}:`, error);
      return null;
    }
  }

  public async updateUser(id: number, userData: UpdateUserRequest): Promise<UserProfile | null> {
    try {
      const data = await apiClient.patch<UserProfile>(`/users/${id}/`, userData);
      return data;
    } catch (error) {
      console.error(`Failed to update user with ID ${id}:`, error);
      return null;
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/users/${id}/`);
      return true;
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
      return false;
    }
  }
}

export const userService = new UserService();