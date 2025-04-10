
import apiClient from './apiClient';
import { Order } from '../types';

export const orderService = {
  getOrdersByBuyerId: async (buyerId: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get(`/orders/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      console.error('Get buyer orders error:', error);
      throw error;
    }
  },

  getOrdersByFarmerId: async (farmerId: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get(`/orders/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Get farmer orders error:', error);
      throw error;
    }
  },

  createOrder: async (orderData: {
    productId: string;
    buyerId: string;
    buyerName: string;
    farmerId: string;
    farmerName: string;
    quantityOrdered: number;
    totalPrice: number;
  }): Promise<Order> => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },
};

export default orderService;
