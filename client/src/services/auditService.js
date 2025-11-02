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

// Get all audit logs
export const getAuditLogs = async (limit = 100) => {
  try {
    const response = await api.get(`/audit?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get audit logs for a specific entity
export const getAuditLogsByEntity = async (entityId) => {
  try {
    const response = await api.get(`/audit/entity/${entityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
