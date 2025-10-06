import { io, Socket } from 'socket.io-client';
import { storage } from '@/utils/storage';
import { SendMessagePayload, SocketMessageReceived } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private readonly baseURL: string;

  constructor() {
    // Use separate URL for WebSocket connection (direct to backend, no proxy)
    this.baseURL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:8080';
  }

  async connect(): Promise<void> {
    try {
      const token = await storage.getItemAsync('accessToken');

      if (!token) {
        console.warn('🔐 No authentication token found, cannot connect to socket');
        return;
      }

      console.log('🔌 Attempting to connect to socket at:', this.baseURL);
      console.log('🔑 Using token:', token ? 'Token present' : 'No token');

      this.socket = io(this.baseURL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        transports: ['websocket', 'polling'], // Try both transports
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔴 Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection error:', error);
        console.error('🔴 Error details:', {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type
        });
      });

      this.socket.on('exception', (error) => {
        console.error('🔴 Socket exception:', error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Socket reconnection attempt:', attemptNumber);
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
        console.log('📤 Sending message via socket:', payload);

        // Send message without expecting callback response
        // Backend will send 'receiveMessage' and 'messageConfirmed' events separately
        this.socket.emit('message', payload);

        console.log('✅ Message emit completed');
        resolve(); // Resolve immediately after emit
      } else {
        console.warn('🔴 Socket not connected');
        reject(new Error('Socket not connected'));
      }
    });
  }

  onMessageReceived(callback: (message: SocketMessageReceived) => void): void {
    if (this.socket) {
      // Remove any existing listener first to prevent duplicates
      this.socket.off('receiveMessage');
      this.socket.on('receiveMessage', callback);
    }
  }

  onMessageConfirmed(callback: (response: { success: boolean; message: any }) => void): void {
    if (this.socket) {
      // Remove any existing listener first to prevent duplicates
      this.socket.off('messageConfirmed');
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

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();