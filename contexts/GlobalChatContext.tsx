import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { socketService } from '@/services/socket/socketService';
import { Chat, ChatMessage, SocketMessageReceived, ChatWithLastMessage } from '@/types';

interface GlobalChatContextType {
  // Chat management
  chats: Map<number, Chat>;
  conversations: ChatWithLastMessage[];

  // Active chat management
  activeChatId: number | null;
  setActiveChatId: (chatId: number | null) => void;

  // Message management
  sendMessage: (chatId: number, receiverId: number, content: string) => Promise<void>;
  addMessage: (chatId: number, message: ChatMessage) => void;

  // Chat operations
  loadChat: (userId: number) => Promise<Chat | null>;
  loadConversations: () => Promise<void>;

  // Socket management
  joinChatRoom: (chatId: number) => void;
  leaveChatRoom: (chatId: number) => void;

  // State
  loading: boolean;
  isConnected: boolean;
}

const GlobalChatContext = createContext<GlobalChatContextType | null>(null);

export const useGlobalChat = () => {
  const context = useContext(GlobalChatContext);
  if (!context) {
    throw new Error('useGlobalChat must be used within a GlobalChatProvider');
  }
  return context;
};

export const GlobalChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Map<number, Chat>>(new Map());
  const [conversations, setConversations] = useState<ChatWithLastMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Use refs to avoid stale closures in socket listeners
  const chatsRef = useRef(chats);
  const conversationsRef = useRef(conversations);
  const userRef = useRef(user);

  // Update refs when state changes
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const initializeSocket = async () => {
      try {
        if (!socketService.isConnected()) {
          await socketService.connect();
        }

        setIsConnected(socketService.isConnected());

        if (socketService.isConnected()) {
          console.log('🌐 Global chat provider connected to socket');
          setupSocketListeners();
        }
      } catch (error) {
        console.error('❌ Failed to connect socket in GlobalChatProvider:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      cleanupSocketListeners();
    };
  }, [user]);

  const setupSocketListeners = useCallback(() => {
    // Global message listener - handles ALL incoming messages
    socketService.onMessageReceived((message: SocketMessageReceived) => {
      console.log('📨 Global message received:', {
        chatId: message.chat.id,
        from: message.sender.name,
        content: message.content.substring(0, 50) + '...'
      });

      const currentUser = userRef.current;
      if (!currentUser || message.sender.id === currentUser.id) {
        return; // Ignore own messages
      }

      // Update specific chat if it's loaded
      const currentChats = chatsRef.current;
      if (currentChats.has(message.chat.id)) {
        setChats(prev => {
          const newChats = new Map(prev);
          const chat = newChats.get(message.chat.id);
          if (chat) {
            const newMessage: ChatMessage = {
              id: message.id,
              content: message.content,
              createdAt: message.createdAt,
              sender: message.sender,
            };

            // Avoid duplicates
            const exists = chat.messages.some(msg => msg.id === newMessage.id);
            if (!exists) {
              chat.messages = [...chat.messages, newMessage];
              newChats.set(message.chat.id, { ...chat });
            }
          }
          return newChats;
        });
      }

      // Update conversations list
      setConversations(prev => {
        const existingIndex = prev.findIndex(conv => conv.id === message.chat.id);
        const newMessage: ChatMessage = {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          sender: message.sender,
        };

        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: newMessage,
          };

          // Sort by last message time
          return updated.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
          });
        } else {
          // New conversation - reload from server
          console.log('🆕 New conversation detected, reloading...');
          loadConversations();
          return prev;
        }
      });
    });

    // Connection status listeners
    socketService.getSocket()?.on('connect', () => {
      console.log('✅ Global chat socket connected');
      setIsConnected(true);
    });

    socketService.getSocket()?.on('disconnect', () => {
      console.log('🔴 Global chat socket disconnected');
      setIsConnected(false);
    });

    socketService.getSocket()?.on('reconnect', () => {
      console.log('🔄 Global chat socket reconnected');
      setIsConnected(true);
      // Rejoin active chat room if any
      if (activeChatId) {
        joinChatRoom(activeChatId);
      }
    });

  }, [activeChatId]);

  const cleanupSocketListeners = useCallback(() => {
    socketService.removeMessageListener();
    socketService.getSocket()?.off('connect');
    socketService.getSocket()?.off('disconnect');
    socketService.getSocket()?.off('reconnect');
  }, []);

  const joinChatRoom = useCallback((chatId: number) => {
    if (socketService.isConnected()) {
      console.log(`👥 Joining chat room: ${chatId}`);
      socketService.getSocket()?.emit('joinChat', chatId);
    }
  }, []);

  const leaveChatRoom = useCallback((chatId: number) => {
    if (socketService.isConnected()) {
      console.log(`👋 Leaving chat room: ${chatId}`);
      socketService.getSocket()?.emit('leaveChat', chatId);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: number, receiverId: number, content: string) => {
    if (!user) throw new Error('User not authenticated');

    // Add optimistic message to local state
    const tempMessage: ChatMessage = {
      id: Date.now(), // Temporary ID
      content,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    // Update local chat
    setChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        chat.messages = [...chat.messages, tempMessage];
        newChats.set(chatId, { ...chat });
      }
      return newChats;
    });

    try {
      if (socketService.isConnected()) {
        await socketService.sendMessage({
          receiverId,
          content,
        });
        console.log('✅ Message sent successfully');
      } else {
        throw new Error('Socket not connected');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);

      // Remove optimistic message on error
      setChats(prev => {
        const newChats = new Map(prev);
        const chat = newChats.get(chatId);
        if (chat) {
          chat.messages = chat.messages.filter(msg => msg.id !== tempMessage.id);
          newChats.set(chatId, { ...chat });
        }
        return newChats;
      });

      throw error;
    }
  }, [user]);

  const addMessage = useCallback((chatId: number, message: ChatMessage) => {
    setChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        // Avoid duplicates
        const exists = chat.messages.some(msg => msg.id === message.id);
        if (!exists) {
          chat.messages = [...chat.messages, message];
          newChats.set(chatId, { ...chat });
        }
      }
      return newChats;
    });
  }, []);

  const loadChat = useCallback(async (userId: number): Promise<Chat | null> => {
    try {
      setLoading(true);
      console.log('📥 Loading chat for user:', userId);

      // Import here to avoid circular dependency
      const { userChatApi } = await import('@/services/api/userChat');
      const chatData = await userChatApi.getConversation(userId);

      console.log('✅ Chat loaded successfully:', chatData.id);

      // Store in global state
      setChats(prev => {
        const newChats = new Map(prev);
        newChats.set(chatData.id, chatData);
        return newChats;
      });

      return chatData;
    } catch (error) {
      console.error('❌ Error loading chat:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📥 Loading conversations...');

      // Import here to avoid circular dependency
      const { userChatApi } = await import('@/services/api/userChat');
      const data = await userChatApi.getConversations();

      // Sort by last message time
      const sortedData = data.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

      console.log('✅ Conversations loaded:', sortedData.length);
      setConversations(sortedData);
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: GlobalChatContextType = {
    chats,
    conversations,
    activeChatId,
    setActiveChatId,
    sendMessage,
    addMessage,
    loadChat,
    loadConversations,
    joinChatRoom,
    leaveChatRoom,
    loading,
    isConnected,
  };

  return (
    <GlobalChatContext.Provider value={value}>
      {children}
    </GlobalChatContext.Provider>
  );
};