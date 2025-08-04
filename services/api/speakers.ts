import axiosClient from '../config/axiosClient';
import { Speaker } from '@/types';

export const speakersApi = {
  getSpeakers: async (): Promise<Speaker[]> => {
    const response = await axiosClient.get('/speakers');
    return response.data;
  },

  getSpeakerById: async (id: number): Promise<Speaker> => {
    const response = await axiosClient.get(`/speakers/${id}`);
    return response.data;
  },
};