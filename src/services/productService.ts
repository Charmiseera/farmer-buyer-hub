
import apiClient from './apiClient';
import { Product } from '../types';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  getProductsByFarmerId: async (farmerId: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get(`/products/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Get farmer products error:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const response = await apiClient.put(`/products/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },
};

export default productService;
