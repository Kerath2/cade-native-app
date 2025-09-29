import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { ArrowLeft, Send, User } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { userChatApi } from '@/services/api/userChat';
import { socketService } from '@/services/socket/socketService';
import { Chat, ChatMessage, User as UserType, SocketMessageReceived, SendMessagePayload } from '@/types';
import Colors from '@/constants/Colors';

export default function ChatDetailPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const { user: currentUser } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const userIdNumber = parseInt(userId!, 10);

  useEffect(() => {
    loadChat();
    setupSocket();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      socketService.removeMessageListener();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [userIdNumber]);

  useEffect(() => {
    if (chat) {
      const other = chat.users.find(u => u.id !== currentUser?.id);
      setOtherUser(other || null);
      setMessages(chat.messages || []);
    }
  }, [chat, currentUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const setupSocket = async () => {
    try {
      if (!socketService.isConnected()) {
        await socketService.connect();
      }

      if (!socketService.isConnected()) {
        console.warn('Socket connection failed, messages will be sent without real-time updates');
        return;
      }

      socketService.onMessageReceived((message: SocketMessageReceived) => {
        // Only add message if it's for this chat and from the other user
        if (message.chat.id === chat?.id && message.sender.id !== currentUser?.id) {
          const newMessage: ChatMessage = {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender,
          };

          setMessages(prev => [...prev, newMessage]);
        }
      });
    } catch (error) {
      console.error('Error setting up socket:', error);
    }
  };

  const loadChat = async () => {
    try {
      setLoading(true);
      const chatData = await userChatApi.getConversation(userIdNumber);
      setChat(chatData);
    } catch (error) {
      console.error('Error loading chat:', error);

      // If chat doesn't exist, we can still show the interface
      // The backend will create it when first message is sent
      const mockChat: Chat = {
        id: 0, // Will be assigned by backend
        users: [],
        messages: [],
      };
      setChat(mockChat);

      // Try to load user info
      try {
        const users = await userChatApi.getUsers();
        const other = users.find(u => u.id === userIdNumber);
        if (other) {
          setOtherUser(other);
          mockChat.users = [other];
        }
      } catch (userError) {
        console.error('Error loading user:', userError);
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || sending || !currentUser) return;

    const messageContent = inputText.trim();
    setInputText('');
    setSending(true);

    // Add message optimistically to UI
    const tempMessage: ChatMessage = {
      id: Date.now(), // Temporary ID
      content: messageContent,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      // Send via socket if connected, otherwise just update UI optimistically
      if (socketService.isConnected()) {
        const payload: SendMessagePayload = {
          receiverId: userIdNumber,
          content: messageContent,
        };

        await socketService.sendMessage(payload);
        console.log('Message sent successfully via socket');
      } else {
        console.warn('Socket not connected, message sent optimistically');
        // In a real app, you might want to queue messages or use HTTP API as fallback
      }

      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setInputText(messageContent); // Restore input
      setSending(false);

      Alert.alert('Error', 'No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima'
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.sender.id === currentUser?.id;

    return (
      <View
        style={{ width: '100%' }}
        className={`flex-row mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isCurrentUser && (
          <View
            style={{ backgroundColor: Colors.primary }}
            className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
          >
            <User size={16} color="#FFFFFF" />
          </View>
        )}

        <View
          style={{
            backgroundColor: isCurrentUser ? Colors.primary : Colors.cardBackground,
            borderColor: isCurrentUser ? Colors.primary : Colors.border,
            maxWidth: '75%',
          }}
          className={`px-4 py-3 rounded-2xl border ${
            isCurrentUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
        >
          <Text
            style={{
              color: isCurrentUser ? '#FFFFFF' : Colors.text,
            }}
            className="text-base leading-5"
          >
            {item.content}
          </Text>
          <Text
            style={{
              color: isCurrentUser ? '#FFFFFF80' : '#888888',
            }}
            className="text-xs mt-1"
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>

        {isCurrentUser && (
          <View
            style={{ backgroundColor: Colors.backgroundTertiary }}
            className="w-8 h-8 rounded-full items-center justify-center ml-3 mt-1"
          >
            <User size={16} color={Colors.primary} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }} className="items-center justify-center">
        <Text style={{ color: Colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2c3c94' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2c3c94"
        translucent={false}
      />

      {/* Header */}
      <View style={{ backgroundColor: '#2c3c94' }} className="px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <User size={20} color="#FFFFFF" />
        </View>

        <View className="flex-1">
          <Text className="text-white text-lg font-semibold" numberOfLines={1}>
            {otherUser?.name || 'Usuario'}
          </Text>
          {otherUser?.email && (
            <Text className="text-white opacity-70 text-sm" numberOfLines={1}>
              {otherUser.email}
            </Text>
          )}
        </View>
      </View>

      {/* Chat Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
          contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text style={{ color: Colors.textSecondary }} className="text-center">
                Inicia la conversación enviando un mensaje
              </Text>
            </View>
          }
        />

        {/* Input Container */}
        <View
          style={{
            backgroundColor: Colors.backgroundSecondary,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 34 : 12,
          }}
        >
          <View className="flex-row items-end">
            <TextInput
              style={{
                backgroundColor: Colors.background,
                borderColor: Colors.border,
                color: Colors.text,
                borderWidth: 1,
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 12,
                maxHeight: 100,
                minHeight: 48,
                fontSize: 16,
                textAlignVertical: 'center',
              }}
              className="flex-1"
              placeholder="Escribe tu mensaje..."
              placeholderTextColor={Colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              maxLength={500}
              editable={!sending}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || sending}
              style={{
                backgroundColor:
                  inputText.trim() && !sending
                    ? Colors.primary
                    : Colors.backgroundTertiary,
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send
                size={22}
                color={
                  inputText.trim() && !sending
                    ? '#FFFFFF'
                    : Colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}