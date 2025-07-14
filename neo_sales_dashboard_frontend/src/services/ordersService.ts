import { apiClient } from '../services/apiClientV2';
import { Order, CreateOrderRequest, UpdateOrderRequest } from '../types/api';

class OrdersService {
  public async getAllOrders(): Promise<Order[] | null> {
    try {
      const data = await apiClient.get<Order[]>('/orders/');
      return data;
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      return null;
    }
  }

  public async createOrder(orderData: CreateOrderRequest): Promise<Order | null> {
    try {
      const data = await apiClient.post<Order>('/orders/', orderData);
      return data;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  }

  public async getOrderById(id: number): Promise<Order | null> {
    try {
      const data = await apiClient.get<Order>(`/orders/${id}/`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch order with ID ${id}:`, error);
      return null;
    }
  }

  public async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order | null> {
    try {
      const data = await apiClient.patch<Order>(`/orders/${id}/`, orderData);
      return data;
    } catch (error) {
      console.error(`Failed to update order with ID ${id}:`, error);
      return null;
    }
  }

  public async deleteOrder(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/orders/${id}/`);
      return true;
    } catch (error) {
      console.error(`Failed to delete order with ID ${id}:`, error);
      return false;
    }
  }
}

export const ordersService = new OrdersService();