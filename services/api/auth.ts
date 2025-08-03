import axiosClient from '../config/axiosClient';
import { User } from '@/types/user';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  user: User;
  accessToken: string;
}

interface GenerateOtpRequest {
  email: string;
}

interface ValidateOtpRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await axiosClient.post('/auth/refresh', data);
    return response.data;
  },

  generateOtp: async (data: GenerateOtpRequest) => {
    const response = await axiosClient.post('/auth/generate-otp', data);
    return response.data;
  },

  validateOtp: async (data: ValidateOtpRequest) => {
    const response = await axiosClient.post('/auth/validate-otp', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  },
};