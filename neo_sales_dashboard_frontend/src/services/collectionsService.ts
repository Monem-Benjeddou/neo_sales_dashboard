import { apiClient } from '../services/apiClientV2';
import { CollectionListItem, Collection, CreateCollectionRequest, UpdateCollectionRequest } from '../types/api';

class CollectionsService {
  public async getCollectionsList(): Promise<CollectionListItem[] | null> {
    try {
      const data = await apiClient.get<CollectionListItem[]>('/collections-list/');
      return data;
    } catch (error) {
      console.error('Failed to fetch collections list:', error);
      return null;
    }
  }

  public async getAllCollections(): Promise<Collection[] | null> {
    try {
      const data = await apiClient.get<Collection[]>('/collections/');
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