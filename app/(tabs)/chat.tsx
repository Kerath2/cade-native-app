import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TextInput,
} from 'react-native';
import { MessageCircle, Search, Plus, Bot, User } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalChat } from '@/contexts/GlobalChatContext';
import { ChatWithLastMessage, User as UserType } from '@/types';
import Colors from '@/constants/Colors';

export default function ChatPage() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { conversations, loadConversations, loading } = useGlobalChat();

  const [filteredConversations, setFilteredConversations] = useState<ChatWithLastMessage[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Cargar conversaciones al montar
  useEffect(() => {
    loadConversations();
  }, []);

  // Recargar cuando la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Chat screen focused, reloading conversations...');
      loadConversations();
    }, [])
  );

  // Filtrar conversaciones según búsqueda
  useEffect(() => {
    if (searchText.trim()) {
      const filtered = conversations.filter((conv) =>
        conv.users.some((u) =>
          u.id !== user?.id && u.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchText, conversations, user?.id]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  // Obtener el otro usuario de la conversación
  const getOtherUser = (conversation: ChatWithLastMessage): UserType | undefined => {
    return conversation.users.find(u => u.id !== user?.id);
  };

  // Formatear hora del último mensaje
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima'
      });
    } else {
      return date.toLocaleDateString('es-PE', {
        month: 'short',
        day: 'numeric',
        timeZone: 'America/Lima'
      });
    }
  };

  // Renderizar conversación
  const renderConversation = ({ item }: { item: ChatWithLastMessage }) => {
    const otherUser = getOtherUser(item);
    if (!otherUser) return null;

    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Navigating to chat-detail with userId:', otherUser.id);
          navigation.navigate('chat-detail' as any, { userId: otherUser.id });
        }}
        style={{
          backgroundColor: Colors.background,
          borderBottomColor: Colors.border,
        }}
        className="px-4 py-4 border-b"
      >
        <View className="flex-row items-center">
          {/* Avatar */}
          <View
            style={{ backgroundColor: Colors.primary }}
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
          >
            <User size={24} color="#FFFFFF" />
          </View>

          {/* Contenido */}
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text
                style={{ color: Colors.text }}
                className="font-semibold text-base"
                numberOfLines={1}
              >
                {otherUser.name}
              </Text>
              {item.lastMessage && (
                <Text
                  style={{ color: Colors.textSecondary }}
                  className="text-xs"
                >
                  {formatTime(item.lastMessage.createdAt)}
                </Text>
              )}
            </View>

            {item.lastMessage ? (
              <Text
                style={{ color: Colors.textSecondary }}
                className="text-sm"
                numberOfLines={2}
              >
                {item.lastMessage.sender.id === user?.id ? 'Tú: ' : ''}
                {item.lastMessage.content}
              </Text>
            ) : (
              <Text
                style={{ color: Colors.textSecondary }}
                className="text-sm italic"
              >
                Inicia una conversación
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2c3c94' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#2c3c94' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />

        {/* Header */}
        <View style={{ backgroundColor: '#2c3c94' }} className="px-4 py-3">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-xl font-bold">Conversaciones</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  console.log('Navigating to assistant...');
                  navigation.navigate('assistant' as any);
                }}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <Bot size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('Navigating to users...');
                  navigation.navigate('users' as any);
                }}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Búsqueda */}
          <View className="flex-row items-center">
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              className="flex-1 flex-row items-center border rounded-full px-4 py-2"
            >
              <Search size={16} color="rgba(255,255,255,0.7)" className="mr-2" />
              <TextInput
                style={{ color: '#FFFFFF' }}
                className="flex-1 text-white"
                placeholder="Buscar conversaciones..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
        </View>

        {/* Lista de conversaciones */}
        <View style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}>
          {filteredConversations.length === 0 && !loading ? (
            <View className="flex-1 items-center justify-center px-8">
              <MessageCircle size={64} color={Colors.textSecondary} />
              <Text
                style={{ color: Colors.text }}
                className="text-lg font-semibold mt-4 text-center"
              >
                {searchText ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
              </Text>
              <Text
                style={{ color: Colors.textSecondary }}
                className="text-center mt-2"
              >
                {searchText
                  ? 'Intenta con otro término de búsqueda'
                  : 'Toca el botón + para iniciar una nueva conversación'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              renderItem={renderConversation}
              keyExtractor={(item) => `chat-${item.id}`}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
