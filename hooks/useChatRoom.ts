import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '@/services/socket/socketService';
import { userChatApi } from '@/services/api/userChat';
import { Chat, ChatMessage, SocketMessageReceived, User as UserType } from '@/types';

/**
 * Hook personalizado para manejar un chat individual
 *
 * Responsabilidades:
 * - Cargar chat y mensajes desde el servidor
 * - Unirse al room del socket
 * - Escuchar mensajes nuevos en tiempo real
 * - Enviar mensajes
 * - Manejar estado local del chat
 */

interface UseChatRoomParams {
  userId: number; // ID del otro usuario
  currentUserId: number; // ID del usuario actual
}

interface UseChatRoomReturn {
  // Datos
  chat: Chat | null;
  messages: ChatMessage[];
  otherUser: UserType | null;

  // Estados
  loading: boolean;
  sending: boolean;
  error: string | null;

  // Acciones
  sendMessage: (content: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useChatRoom = ({ userId, currentUserId }: UseChatRoomParams): UseChatRoomReturn => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para evitar stale closures
  const chatRef = useRef<Chat | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Sincronizar refs con state
  useEffect(() => {
    chatRef.current = chat;
    messagesRef.current = messages;
  }, [chat, messages]);

  // Cargar chat desde el servidor
  const loadChat = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 useChatRoom: Loading chat for user', userId);

      const chatData = await userChatApi.getConversation(userId);

      console.log('✅ useChatRoom: Chat loaded, ID:', chatData.id, 'Messages:', chatData.messages.length);

      setChat(chatData);

      // Ordenar mensajes por fecha (del más antiguo al más reciente)
      const sortedMessages = [...chatData.messages].sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      setMessages(sortedMessages);

      // Encontrar el otro usuario
      const other = chatData.users.find(u => u.id !== currentUserId);
      setOtherUser(other || null);

      return chatData;
    } catch (err: any) {
      // Si el chat no existe (404), cargar info del usuario
      if (err?.response?.status === 404) {
        console.log('💭 useChatRoom: Chat does not exist yet, loading user info');
        try {
          const users = await userChatApi.getUsers();
          const other = users.find(u => u.id === userId);
          if (other) {
            console.log('✅ useChatRoom: User found:', other.name);
            setOtherUser(other);
            setChat(null);
            setMessages([]);
            setError(null); // No error, es un chat nuevo
            return null;
          } else {
            console.error('❌ useChatRoom: User not found in users list');
            setError('Usuario no encontrado');
            return null;
          }
        } catch (userErr) {
          console.error('❌ useChatRoom: Error loading user:', userErr);
          setError('No se pudo cargar la información del usuario');
          return null;
        }
      } else {
        console.error('❌ useChatRoom: Error loading chat:', err);
        setError('No se pudo cargar el chat');
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, [userId, currentUserId]);

  // Enviar mensaje
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;

    const trimmedContent = content.trim();
    setSending(true);

    try {
      console.log('📤 useChatRoom: Sending message');

      // Enviar mensaje via socket
      await socketService.sendMessage({
        receiverId: userId,
        content: trimmedContent,
      });

      console.log('✅ useChatRoom: Message sent successfully');
    } catch (err) {
      console.error('❌ useChatRoom: Error sending message:', err);
      throw err;
    } finally {
      setSending(false);
    }
  }, [userId, sending]);

  // Refrescar chat
  const refresh = useCallback(async () => {
    await loadChat();
  }, [loadChat]);

  // Listener para confirmación de mensaje - SIEMPRE activo (incluso para chats nuevos)
  useEffect(() => {
    const handleMessageConfirmed = async (response: any) => {
      if (response.success && response.chatId && !chatRef.current) {
        console.log('✅ useChatRoom: New chat created, ID:', response.chatId);
        // Recargar el chat completo
        await loadChat();
      }
    };

    socketService.getSocket()?.on('messageConfirmed', handleMessageConfirmed);

    return () => {
      socketService.getSocket()?.off('messageConfirmed', handleMessageConfirmed);
    };
  }, [loadChat]);

  // Configurar listeners del socket y unirse al room - SOLO cuando el chat existe
  useEffect(() => {
    if (!chat?.id) return;

    const chatId = chat.id;
    console.log('🔗 useChatRoom: Joining room', chatId);

    // Unirse al room
    socketService.getSocket()?.emit('joinChat', chatId);

    // Listener para mensajes nuevos
    const handleNewMessage = (message: SocketMessageReceived) => {
      // Solo procesar mensajes de este chat
      if (message.chat.id !== chatId) return;

      console.log('📨 useChatRoom: New message received', {
        chatId: message.chat.id,
        from: message.sender.name,
        content: message.content.substring(0, 30) + '...'
      });

      const newMessage: ChatMessage = {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender,
      };

      // Agregar mensaje evitando duplicados
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === newMessage.id);
        if (exists) {
          console.log('⏭️ useChatRoom: Duplicate message ignored');
          return prev;
        }
        console.log('💬 useChatRoom: Message added to chat');
        return [...prev, newMessage];
      });
    };

    // Registrar listener
    socketService.getSocket()?.on('receiveMessage', handleNewMessage);

    // Cleanup
    return () => {
      console.log('👋 useChatRoom: Leaving room', chatId);
      socketService.getSocket()?.emit('leaveChat', chatId);
      socketService.getSocket()?.off('receiveMessage', handleNewMessage);
    };
  }, [chat?.id]);

  // Cargar chat al montar
  useEffect(() => {
    loadChat();
  }, [loadChat]);

  return {
    chat,
    messages,
    otherUser,
    loading,
    sending,
    error,
    sendMessage,
    refresh,
  };
};
