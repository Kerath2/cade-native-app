import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { socketService } from '@/services/socket/socketService';
import { ChatWithLastMessage, SocketMessageReceived } from '@/types';

/**
 * GlobalChatContext - Maneja solo:
 * 1. Conexión global del socket
 * 2. Lista de conversaciones (no mensajes individuales)
 * 3. Estado de conexión
 *
 * Los chats individuales se manejan con el hook useChatRoom
 */

interface GlobalChatContextType {
  // Lista de conversaciones
  conversations: ChatWithLastMessage[];
  loadConversations: () => Promise<void>;
  refreshConversations: () => Promise<void>;

  // Estado
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
  const [conversations, setConversations] = useState<ChatWithLastMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Limpiar conversaciones cuando el usuario cambia o hace logout
  useEffect(() => {
    if (!user) {
      setConversations([]);
    }
  }, [user?.id]);

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    if (loading) return; // Evitar llamadas concurrentes

    try {
      setLoading(true);
      console.log('📥 GlobalChat: Loading conversations...');

      const { userChatApi } = await import('@/services/api/userChat');
      const data = await userChatApi.getConversations();

      // Ordenar por último mensaje
      const sorted = data.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

      console.log('✅ GlobalChat: Loaded', sorted.length, 'conversations');
      setConversations(sorted);
    } catch (error) {
      console.error('❌ GlobalChat: Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Refrescar conversaciones (permite llamadas concurrentes)
  const refreshConversations = useCallback(async () => {
    try {
      console.log('🔄 GlobalChat: Refreshing conversations...');

      const { userChatApi } = await import('@/services/api/userChat');
      const data = await userChatApi.getConversations();

      const sorted = data.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

      console.log('✅ GlobalChat: Refreshed', sorted.length, 'conversations');
      setConversations(sorted);
    } catch (error) {
      console.error('❌ GlobalChat: Error refreshing conversations:', error);
    }
  }, []);

  // Inicializar socket y listeners cuando el usuario está autenticado
  // IMPORTANTE: Se desconecta y reconecta cuando cambia el usuario (user.id cambia)
  useEffect(() => {
    if (!user) {
      // Si no hay usuario, desconectar socket
      console.log('🔴 GlobalChat: No user, disconnecting socket');
      socketService.disconnect();
      setIsConnected(false);
      return;
    }

    let mounted = true;
    let messageListenerRegistered = false;

    // Handler para mensajes nuevos
    const handleNewMessage = (message: SocketMessageReceived) => {
      console.log('📨 GlobalChat: New message received for conversations update', {
        chatId: message.chat.id,
        messageId: message.id,
        from: message.sender.name,
        senderId: message.sender.id,
        content: message.content.substring(0, 30),
      });

      // Actualizar la lista de conversaciones
      setConversations(prev => {
        console.log('📋 GlobalChat: Current conversations count:', prev.length);
        const chatIndex = prev.findIndex(conv => conv.id === message.chat.id);
        console.log('📋 GlobalChat: Chat index in conversations:', chatIndex);

        const newMessage = {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          sender: message.sender,
        };

        if (chatIndex >= 0) {
          // Actualizar conversación existente
          console.log('✏️ GlobalChat: Updating existing conversation at index:', chatIndex);
          const updated = [...prev];
          updated[chatIndex] = {
            ...updated[chatIndex],
            lastMessage: newMessage,
          };

          // Re-ordenar por último mensaje - crear nuevo array ordenado
          const sorted = [...updated].sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
          });

          console.log('✅ GlobalChat: Conversation updated and sorted, returning new array');
          return sorted;
        } else {
          // Nueva conversación - recargar desde el servidor
          console.log('🆕 GlobalChat: New conversation detected, reloading...');
          refreshConversations();
          return prev;
        }
      });
    };

    // Registrar listener de mensajes
    const registerMessageListener = () => {
      const socket = socketService.getSocket();
      if (socket && socket.connected && !messageListenerRegistered) {
        console.log('🎧 GlobalChat: Registering global message listener');
        socket.on('receiveMessage', handleNewMessage);
        messageListenerRegistered = true;
        console.log('✅ GlobalChat: Global receiveMessage listener registered');
      } else if (!socket) {
        console.warn('⚠️ GlobalChat: Socket not available for listener registration');
      } else if (!socket.connected) {
        console.warn('⚠️ GlobalChat: Socket not connected yet for listener registration');
      }
    };

    const initSocket = async () => {
      try {
        console.log('🔌 GlobalChat: Initializing socket for user:', user.id, user.email);

        // Desconectar socket anterior (si existe)
        if (socketService.isConnected()) {
          console.log('🔄 GlobalChat: Disconnecting previous socket connection');
          socketService.disconnect();
        }

        // Conectar con el nuevo token
        await socketService.connect();

        if (mounted) {
          const connected = socketService.isConnected();
          setIsConnected(connected);
          console.log('🌐 GlobalChat: Socket initialized for user:', user.email, 'Connected:', connected);

          // Registrar listener de mensajes inmediatamente después de conectar
          if (connected) {
            // Pequeño delay para asegurar que el socket esté completamente listo
            setTimeout(() => {
              if (mounted) {
                registerMessageListener();
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('❌ GlobalChat: Failed to initialize socket:', error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    // Listeners de conexión
    const handleConnect = () => {
      console.log('✅ GlobalChat: Socket connected for user:', user.email);
      if (mounted) {
        setIsConnected(true);
        // Registrar listener cuando el socket se conecte
        setTimeout(() => {
          if (mounted) {
            registerMessageListener();
          }
        }, 100);
      }
    };

    const handleDisconnect = () => {
      console.log('🔴 GlobalChat: Socket disconnected');
      if (mounted) {
        setIsConnected(false);
        messageListenerRegistered = false;
      }
    };

    initSocket();

    // Registrar listeners de conexión DESPUÉS de intentar conectar
    setTimeout(() => {
      const socket = socketService.getSocket();
      if (socket) {
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        console.log('🔗 GlobalChat: Connection event listeners registered');
      }
    }, 50);

    return () => {
      console.log('🧹 GlobalChat: Cleaning up for user:', user.email);
      mounted = false;

      const socket = socketService.getSocket();
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        if (messageListenerRegistered) {
          socket.off('receiveMessage', handleNewMessage);
          console.log('🔇 GlobalChat: Global receiveMessage listener removed');
        }
      }
      // No desconectar aquí porque puede ser solo unmount del componente
    };
  }, [user?.id, refreshConversations]); // Dependencias: user.id y refreshConversations

  const value: GlobalChatContextType = {
    conversations,
    loadConversations,
    refreshConversations,
    loading,
    isConnected,
  };

  return (
    <GlobalChatContext.Provider value={value}>
      {children}
    </GlobalChatContext.Provider>
  );
};
