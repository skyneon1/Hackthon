import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const healthLibraryService = {
  // Fetch all health articles
  getArticles: async () => {
    try {
      const response = await axios.get(`${API_URL}/health-articles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health articles:', error);
      throw error;
    }
  },

  // Fetch article by ID
  getArticleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/health-articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Fetch articles by category
  getArticlesByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/health-articles/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw error;
    }
  },

  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/health-categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Search articles
  searchArticles: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/health-articles/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }
}; 