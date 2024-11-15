import axios from 'axios';

const baseApi = axios.create({
  baseURL: 'http://localhost:3002', // Replace with your actual base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can add interceptors for request and response
baseApi.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers if needed
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

baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default baseApi;