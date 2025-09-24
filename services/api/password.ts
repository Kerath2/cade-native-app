import axiosClient from '../config/axiosClient';

interface SendOTPRequest {
  email: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export const passwordApi = {
  sendOTP: async (email: string): Promise<void> => {
    await axiosClient.post<void>('/auth/send-otp', { email });
  },

  verifyOTP: async (email: string, otp: string): Promise<void> => {
    await axiosClient.post<void>('/auth/verify-otp', { email, otp });
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    await axiosClient.post<void>('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
  },
};