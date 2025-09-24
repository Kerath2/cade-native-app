import axiosClient from '../config/axiosClient';
import { Section } from '@/types';

export const sectionsApi = {
  getSections: async (): Promise<Section[]> => {
    const response = await axiosClient.get('/sections');
    return response.data;
  },

  getSectionById: async (id: number): Promise<Section> => {
    const response = await axiosClient.get(`/sections/${id}`);
    return response.data;
  },
};