import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, User, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useChatRoom } from '@/hooks/useChatRoom';
import { ChatMessage } from '@/types';
import Colors from '@/constants/Colors';

/**
 * Pantalla de chat individual
 *
 * Usa el hook useChatRoom para toda la lógica de negocio
 * Este componente solo se encarga de la UI
 */

export default function ChatDetailPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const { user: currentUser } = useAuth();

  const userIdNumber = parseInt(userId, 10);

  // Hook personalizado que maneja toda la lógica del chat
  const {
    chat,
    messages,
    otherUser,
    loading,
    sending,
    error,
    sendMessage,
    refresh,
  } = useChatRoom({
    userId: userIdNumber,
    currentUserId: currentUser?.id || 0,
  });

  // Estado local UI
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    // Prevenir mensaje a uno mismo
    if (currentUser?.id === userIdNumber) {
      Alert.alert('Error', 'No puedes enviarte mensajes a ti mismo');
      return;
    }

    const messageContent = inputText.trim();
    setInputText(''); // Limpiar input inmediatamente

    try {
      await sendMessage(messageContent);
    } catch (err) {
      // Restaurar el texto si falla
      setInputText(messageContent);
      Alert.alert('Error', 'No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  // Limpiar conversación local
  const handleClearConversation = () => {
    Alert.alert(
      'Limpiar Conversación',
      '¿Estás seguro de que quieres salir de esta conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  // Formatear hora del mensaje
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima',
    });
  };

  // Renderizar mensaje individual
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.sender.id === currentUser?.id;

    return (
      <View
        style={{ width: '100%', marginBottom: 16 }}
        className={`flex-row ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {/* Avatar izquierdo (otro usuario) */}
        {!isCurrentUser && (
          <View
            style={{ backgroundColor: Colors.primary }}
            className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
          >
            <User size={16} color="#FFFFFF" />
          </View>
        )}

        {/* Burbuja del mensaje */}
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
            style={{ color: isCurrentUser ? '#FFFFFF' : Colors.text }}
            className="text-base leading-5"
          >
            {item.content}
          </Text>
          <Text
            style={{ color: isCurrentUser ? '#FFFFFF80' : '#888888' }}
            className="text-xs mt-1"
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>

        {/* Avatar derecho (usuario actual) */}
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

  // Pantalla de carga
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }} className="items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ color: Colors.text, marginTop: 16 }}>Cargando chat...</Text>
      </View>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }} className="items-center justify-center px-8">
        <Text style={{ color: Colors.text, fontSize: 18, marginBottom: 16 }}>Error</Text>
        <Text style={{ color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: Colors.primary }}
          className="px-6 py-3 rounded-full"
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2c3c94' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3c94" />

      {/* Header */}
      <View style={{ backgroundColor: '#2c3c94' }} className="px-4 py-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
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

        {/* Botón limpiar */}
        <TouchableOpacity
          onPress={handleClearConversation}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          className="w-10 h-10 rounded-full items-center justify-center ml-3"
        >
          <Trash2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Lista de mensajes */}
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderMessage}
          keyExtractor={(item) => `msg-${item.id}`}
          style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
          inverted
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20" style={{ transform: [{ scaleY: -1 }] }}>
              <Text style={{ color: Colors.textSecondary }} className="text-center">
                Inicia la conversación enviando un mensaje
              </Text>
            </View>
          }
        />

        {/* Input Container */}
        <SafeAreaView
          edges={['bottom']}
          style={{ backgroundColor: Colors.backgroundSecondary }}
        >
          <View
            style={{
              backgroundColor: Colors.backgroundSecondary,
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 12,
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
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputText.trim() || sending}
                style={{
                  backgroundColor:
                    inputText.trim() && !sending ? Colors.primary : Colors.backgroundTertiary,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send
                    size={22}
                    color={inputText.trim() && !sending ? '#FFFFFF' : Colors.textSecondary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
