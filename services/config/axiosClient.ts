import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '@/utils/storage';

// Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/cade-ejecutivos-app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  async (config: any) => {
    const token = await storage.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getItemAsync('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${axiosClient.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;
          await storage.setItemAsync('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await storage.deleteItemAsync('accessToken');
        await storage.deleteItemAsync('refreshToken');
        
        // You can add navigation logic here if needed
        console.log('Token refresh failed, user needs to login again');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;