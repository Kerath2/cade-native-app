import axiosClient from '../config/axiosClient';
import { Session, Comment, Question, Like } from '@/types';

export const sessionsApi = {
  getSessionById: async (id: number): Promise<Session> => {
    const response = await axiosClient.get(`/sessions/${id}`);
    return response.data;
  },

  publishComment: async (sessionId: number, content: string): Promise<Comment> => {
    const response = await axiosClient.post(`/sessions/${sessionId}/comments`, {
      content,
    });
    return response.data;
  },

  publishQuestion: async (sessionId: number, content: string): Promise<Question> => {
    const response = await axiosClient.post(`/sessions/${sessionId}/questions`, {
      content,
    });
    return response.data;
  },

  likeSession: async (sessionId: number): Promise<Like> => {
    const response = await axiosClient.post(`/sessions/${sessionId}/like`);
    return response.data;
  },

  trackUserSession: async (sessionId: number): Promise<{ message: string }> => {
    const response = await axiosClient.post(`/sessions/${sessionId}/track-user`);
    return response.data;
  },
};