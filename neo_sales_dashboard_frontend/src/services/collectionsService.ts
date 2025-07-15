import { apiClient } from '../services/apiClientV2';
import { CollectionListItem, Collection, CreateCollectionRequest, UpdateCollectionRequest, PaginatedResult } from '../types/api';

interface CollectionFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

class CollectionsService {
  public async getCollectionsList(filters?: CollectionFilters): Promise<PaginatedResult<CollectionListItem> | null> {
    try {
      // Build query parameters
      const params: Record<string, string> = {};
      
      if (filters) {
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.page) params.page = filters.page.toString();
        if (filters.pageSize) params.pageSize = filters.pageSize.toString();
      }
      
      const data = await apiClient.get<PaginatedResult<CollectionListItem>>('/collections', {
        params
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch collections list:', error);
      return null;
    }
  }

  public async getAllCollections(): Promise<Collection[] | null> {
    try {
      const data = await apiClient.get<Collection[]>('/collections-list/');
      return data;
    } catch (error) {
      console.error('Failed to fetch all collections (DRF default):', error);
      return null;
    }
  }

  public async createCollection(collectionData: CreateCollectionRequest): Promise<Collection | null> {
    try {
      const data = await apiClient.post<Collection>('/collections/', collectionData);
      return data;
    } catch (error) {
      console.error('Failed to create collection:', error);
      return null;
    }
  }

  public async getCollectionById(id: number): Promise<Collection | null> {
    try {
      const data = await apiClient.get<Collection>(`/collections/${id}/`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch collection with ID ${id}:`, error);
      return null;
    }
  }

  public async updateCollection(id: number, collectionData: UpdateCollectionRequest): Promise<Collection | null> {
    try {
      const data = await apiClient.patch<Collection>(`/collections/${id}/`, collectionData);
      return data;
    } catch (error) {
      console.error(`Failed to update collection with ID ${id}:`, error);
      return null;
    }
  }

  public async deleteCollection(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/collections/${id}/`);
      return true;
    } catch (error) {
      console.error(`Failed to delete collection with ID ${id}:`, error);
      return false;
    }
  }
}

export const collectionsService = new CollectionsService();