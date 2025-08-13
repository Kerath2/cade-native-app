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
  useColorScheme,
} from 'react-native';
import { Send, Bot, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

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
        <View style={{ backgroundColor: colors.primary }} className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1">
          <Bot size={16} color={colors.textInverted} />
        </View>
      )}
      
      <View
        style={{ 
          backgroundColor: item.isUser ? colors.primary : colors.cardBackground,
          borderColor: item.isUser ? colors.primary : colors.border
        }}
        className={`max-w-3/4 px-4 py-3 rounded-2xl border ${
          item.isUser ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
      >
        <Text
          style={{ 
            color: item.isUser ? colors.textInverted : colors.text 
          }}
          className="text-base leading-5"
        >
          {item.content}
        </Text>
        <Text
          style={{ 
            color: item.isUser ? colors.textInverted + '80' : colors.textTertiary 
          }}
          className="text-xs mt-1"
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
      
      {item.isUser && (
        <View style={{ backgroundColor: colors.backgroundTertiary }} className="w-8 h-8 rounded-full items-center justify-center ml-3 mt-1">
          <User size={16} color={colors.primary} />
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View className="flex-row justify-start mb-4">
      <View style={{ backgroundColor: colors.primary }} className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1">
        <Bot size={16} color={colors.textInverted} />
      </View>
      <View style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }} className="border px-4 py-3 rounded-2xl rounded-bl-md">
        <Text style={{ color: colors.textTertiary }} className="italic">Escribiendo...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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

        <View style={{ backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }} className="flex-row items-center px-4 py-3 border-t">
          <TextInput
            style={{ 
              backgroundColor: colors.background, 
              borderColor: colors.border,
              color: colors.text
            }}
            className="flex-1 border rounded-full px-4 py-3 mr-3"
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.backgroundTertiary
            }}
            className="w-12 h-12 rounded-full items-center justify-center"
          >
            <Send
              size={20}
              color={inputText.trim() && !isLoading ? colors.textInverted : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}