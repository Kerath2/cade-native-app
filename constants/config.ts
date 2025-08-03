export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: 10000,
};

export const WATSON_CONFIG = {
  ASSISTANT_ID: process.env.EXPO_PUBLIC_WATSON_ASSISTANT_ID,
  SERVICE_URL: process.env.EXPO_PUBLIC_WATSON_ASSISTANT_URL,
};

export const APP_CONFIG = {
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  IS_DEV: process.env.EXPO_PUBLIC_ENVIRONMENT === 'development',
  IS_PROD: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production',
};

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};