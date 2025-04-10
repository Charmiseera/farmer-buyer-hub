
import axios from 'axios';
import { Product, Order, User } from '../types';

// Base API configuration - this would point to your Express backend
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    location: string;
    phone: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
};

// Product services
export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  getProductsByFarmerId: async (farmerId: string): Promise<Product[]> => {
    try {
      const response = await api.get(`/products/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Get farmer products error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const formData = new FormData();
      
      // Add all product fields to the form data
      Object.entries(productData).forEach(([key, value]) => {
        if (key !== 'image' || typeof value === 'string') {
          formData.append(key, String(value));
        }
      });
      
      // If image is a File object, append it
      if (productData.image instanceof File) {
        formData.append('image', productData.image);
      }
      
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.put(`/products/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },
};

// Order services
export const orderService = {
  getOrdersByBuyerId: async (buyerId: string): Promise<Order[]> => {
    try {
      const response = await api.get(`/orders/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      console.error('Get buyer orders error:', error);
      throw error;
    }
  },

  getOrdersByFarmerId: async (farmerId: string): Promise<Order[]> => {
    try {
      const response = await api.get(`/orders/farmer/${farmerId}`);
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
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },
};

export default api;
