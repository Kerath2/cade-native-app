import { io, Socket } from 'socket.io-client';
import { storage } from '@/utils/storage';
import { SendMessagePayload, SocketMessageReceived } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  }

  async connect(): Promise<void> {
    try {
      const token = await storage.getItemAsync('accessToken');

      if (!token) {
        console.warn('No authentication token found, cannot connect to socket');
        return;
      }

      this.socket = io(this.baseURL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('exception', (error) => {
        console.error('Socket exception:', error);
      });

    } catch (error) {
      console.error('Error connecting to socket:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(payload: SendMessagePayload): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        console.log('Sending message via socket:', payload);
        this.socket.emit('message', payload, (response: any) => {
          console.log('Message sent response:', response);
          if (response && response.success) {
            resolve();
          } else {
            reject(new Error(response?.error || 'Failed to send message'));
          }
        });
      } else {
        console.warn('Socket not connected');
        reject(new Error('Socket not connected'));
      }
    });
  }

  onMessageReceived(callback: (message: SocketMessageReceived) => void): void {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  onMessageConfirmed(callback: (response: { success: boolean; message: any }) => void): void {
    if (this.socket) {
      this.socket.on('messageConfirmed', callback);
    }
  }

  removeMessageConfirmedListener(): void {
    if (this.socket) {
      this.socket.off('messageConfirmed');
    }
  }

  removeMessageListener(): void {
    if (this.socket) {
      this.socket.off('receiveMessage');
      this.socket.off('messageConfirmed');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();