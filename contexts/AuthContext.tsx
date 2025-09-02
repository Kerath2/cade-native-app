import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/utils/storage';
import { authApi } from '@/services/api/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await storage.getItemAsync('accessToken');
      const refreshTokenValue = await storage.getItemAsync('refreshToken');
      
      if (token && refreshTokenValue) {
        // Get user data from storage to avoid refresh on every check
        const userData = await storage.getItemAsync('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Only refresh token if we don't have user data
          await refreshToken();
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Store tokens and user data securely
      await storage.setItemAsync('accessToken', response.accessToken);
      await storage.setItemAsync('refreshToken', response.refreshToken);
      await storage.setItemAsync('userData', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const logout = async () => {
    try {
      // Clear tokens and user data
      await storage.deleteItemAsync('accessToken');
      await storage.deleteItemAsync('refreshToken');
      await storage.deleteItemAsync('userData');
      
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = await storage.getItemAsync('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refresh({ refreshToken: refreshTokenValue });
      
      // Update access token and user data
      await storage.setItemAsync('accessToken', response.accessToken);
      await storage.setItemAsync('userData', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error: any) {
      console.log('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};