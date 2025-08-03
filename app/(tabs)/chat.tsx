import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Bot, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: `¡Hola ${user?.name?.split(' ')[0]}! Soy tu asistente virtual de CADE Ejecutivos 2025. ¿En qué puedo ayudarte hoy?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // TODO: Implement API call to Watson Assistant
      console.log('Sending message to Watson:', inputText);
      
      // Mock response for now
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Gracias por tu mensaje: "${userMessage.content}". Esta es una respuesta simulada. En la implementación real, esto se conectará con Watson Assistant.`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-4 ${item.isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!item.isUser && (
        <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3 mt-1">
          <Bot size={16} color="white" />
        </View>
      )}
      
      <View
        className={`max-w-3/4 px-4 py-3 rounded-2xl ${
          item.isUser
            ? 'bg-blue-600 rounded-br-md'
            : 'bg-gray-200 rounded-bl-md'
        }`}
      >
        <Text
          className={`text-base leading-5 ${
            item.isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {item.content}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
      
      {item.isUser && (
        <View className="w-8 h-8 bg-gray-400 rounded-full items-center justify-center ml-3 mt-1">
          <User size={16} color="white" />
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View className="flex-row justify-start mb-4">
      <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3 mt-1">
        <Bot size={16} color="white" />
      </View>
      <View className="bg-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
        <Text className="text-gray-500 italic">Escribiendo...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? renderTypingIndicator : null}
        />

        <View className="flex-row items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <TextInput
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-3 mr-3 text-gray-800"
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !isLoading ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Send
              size={20}
              color={inputText.trim() && !isLoading ? 'white' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}