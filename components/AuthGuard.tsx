import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inAuthPages = segments[0] === 'session' || segments[0] === 'speaker' || segments[0] === 'section';
    const requiresAuth = inAuthGroup || inAuthPages;

    if (!isAuthenticated && requiresAuth) {
      // User is not authenticated but trying to access protected route
      router.replace('/login');
    } else if (isAuthenticated && !requiresAuth) {
      // User is authenticated but on login/public route
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Cargando...</Text>
      </View>
    );
  }

  return <>{children}</>;
};