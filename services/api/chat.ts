import axiosClient from '../config/axiosClient';

interface ChatMessage {
  message: string;
}

interface ChatResponse {
  response: string;
}

export const chatApi = {
  sendMessage: async (message: string): Promise<string> => {
    try {
      const response = await axiosClient.post<ChatResponse>('/chat', {
        message,
      });
      return response.data.response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('No se pudo enviar el mensaje');
    }
  },
};