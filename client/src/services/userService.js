import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors globally (user no longer exists or token invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User is no longer authenticated (token invalid or user deleted)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reload to trigger re-render and redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Search users by name
export const searchUsers = async (name) => {
  try {
    const response = await api.get('/users/search', {
      params: { name }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Seed database with dummy users
export const seedUsers = async () => {
  try {
    const response = await api.post('/users/seed');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  seedUsers,
};

export default userService;
