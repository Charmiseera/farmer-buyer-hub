
import apiClient from './apiClient';

export const orderService = {
  getOrdersByBuyerId: async (buyerId) => {
    try {
      const response = await apiClient.get(`/orders/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      console.error('Get buyer orders error:', error);
      throw error;
    }
  },

  getOrdersByFarmerId: async (farmerId) => {
    try {
      const response = await apiClient.get(`/orders/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Get farmer orders error:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
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
