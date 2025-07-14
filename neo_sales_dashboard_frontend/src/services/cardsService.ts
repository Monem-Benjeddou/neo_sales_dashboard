import { apiClient } from '../services/apiClientV2';
import { Card, CreateCardRequest, UpdateCardRequest } from '../types/api';

class CardsService {
  public async getAllCards(): Promise<Card[] | null> {
    try {
      const data = await apiClient.get<Card[]>('/cards/');
      return data;
    } catch (error) {
      console.error('Failed to fetch all cards:', error);
      return null;
    }
  }

  public async createCard(cardData: CreateCardRequest): Promise<Card | null> {
    try {
      const data = await apiClient.post<Card>('/cards/', cardData);
      return data;
    } catch (error) {
      console.error('Failed to create card:', error);
      return null;
    }
  }

  public async getCardById(id: number): Promise<Card | null> {
    try {
      const data = await apiClient.get<Card>(`/cards/${id}/`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch card with ID ${id}:`, error);
      return null;
    }
  }

  public async updateCard(id: number, cardData: UpdateCardRequest): Promise<Card | null> {
    try {
      const data = await apiClient.patch<Card>(`/cards/${id}/`, cardData);
      return data;
    } catch (error) {
      console.error(`Failed to update card with ID ${id}:`, error);
      return null;
    }
  }

  public async deleteCard(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/cards/${id}/`);
      return true;
    } catch (error) {
      console.error(`Failed to delete card with ID ${id}:`, error);
      return false;
    }
  }
}

export const cardsService = new CardsService();