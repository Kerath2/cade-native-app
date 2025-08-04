import axiosClient from '../config/axiosClient';
import { Like } from '@/types';

export const favoritesApi = {
  getFavoriteSessions: async (userId: number): Promise<Like[]> => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data.likes || [];
  },
};