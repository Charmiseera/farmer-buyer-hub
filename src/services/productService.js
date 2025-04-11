
import apiClient from './apiClient';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  getProductsByFarmerId: async (farmerId) => {
    try {
      const response = await apiClient.get(`/products/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error('Get farmer products error:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const response = await apiClient.put(`/products/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
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
