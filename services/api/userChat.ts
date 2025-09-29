import axiosClient from '../config/axiosClient';
import { Chat, ChatWithLastMessage, User } from '@/types';

export const userChatApi = {
  // Get all conversations for current user
  getConversations: async (): Promise<ChatWithLastMessage[]> => {
    try {
      const response = await axiosClient.get<ChatWithLastMessage[]>('/chats');
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw new Error('No se pudieron cargar las conversaciones');
    }
  },

  // Get specific conversation with another user
  getConversation: async (userId: number): Promise<Chat> => {
    try {
      const response = await axiosClient.get<Chat>(`/chats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw new Error('No se pudo cargar la conversación');
    }
  },

  // Get all users available for chat
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Making API call to /users...');
      const response = await axiosClient.get<User[]>('/users');
      console.log('API response status:', response.status);
      console.log('API response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting users:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error('No se pudieron cargar los usuarios');
    }
  },
};