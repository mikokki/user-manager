import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios defaults
const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
authAPI.interceptors.request.use(
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
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for login/register endpoints (these are expected to return 401 on failure)
      const isAuthEndpoint = error.config?.url?.includes('/login') ||
                             error.config?.url?.includes('/register');

      if (!isAuthEndpoint) {
        // User is no longer authenticated (token invalid or user deleted)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Reload to trigger re-render and redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const register = async (userData) => {
  try {
    const response = await authAPI.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  try {
    const response = await authAPI.post('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get('/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user data' };
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await authAPI.put('/profile', userData);
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success message and new token
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await authAPI.put('/password', {
      currentPassword,
      newPassword,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get user from localStorage
 * @returns {Object|null} User data
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getStoredUser();
  return !!(token && user);
};

/**
 * Check if user is admin
 * @returns {boolean} Admin status
 */
export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === 'admin';
};
