import axios from 'axios';
import toast from 'react-hot-toast';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds timeout

// Request interceptor - Add auth token to all requests
axios.interceptors.request.use(
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

// Response interceptor - Handle errors globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      const errorMessage = error.message || 'Network error. Please check your connection.';
      console.error('Network error:', errorMessage);
      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // Handle HTTP errors
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Extract error message safely
    let errorMessage = 'An error occurred';
    
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData?.error) {
      errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
    } else if (errorData?.message) {
      errorMessage = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle specific status codes
    if (status === 401) {
      // Unauthorized - clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (status === 404) {
      errorMessage = 'Resource not found';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    // Only show toast if not already shown (avoid duplicate toasts)
    if (!error.config?.skipErrorToast) {
      toast.error(errorMessage);
    }

    // Return a proper error object with message string
    return Promise.reject({
      ...error,
      message: errorMessage,
      status: status,
    });
  }
);

export default axios;

