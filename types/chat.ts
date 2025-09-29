import { User } from './user';

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: User;
}

export interface Chat {
  id: number;
  users: User[];
  messages: ChatMessage[];
}

export interface ChatWithLastMessage {
  id: number;
  users: User[];
  lastMessage?: ChatMessage;
}

export interface SendMessagePayload {
  receiverId: number;
  content: string;
}

export interface SocketMessageReceived {
  id: number;
  content: string;
  createdAt: string;
  sender: User;
  chat: {
    id: number;
  };
}