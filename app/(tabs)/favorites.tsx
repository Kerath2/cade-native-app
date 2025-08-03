import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Clock, Users, Calendar } from 'lucide-react-native';

interface FavoriteSession {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isLive: boolean;
  speakers: any[];
  isFavorited: boolean;
}

export default function FavoritesPage() {
  const [favoriteSessions, setFavoriteSessions] = useState<FavoriteSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to load favorite sessions
      console.log('Loading favorite sessions...');
      // Mock data for now
      setFavoriteSessions([
        {
          id: 1,
          title: 'Apertura CADE Ejecutivos 2025',
          description: 'Ceremonia de apertura del evento',
          startsAt: '2025-11-15T09:00:00Z',
          endsAt: '2025-11-15T10:00:00Z',
          isLive: true,
          speakers: [],
          isFavorited: true,
        },
        {
          id: 2,
          title: 'El futuro de la economía digital',
          description: 'Análisis de las tendencias tecnológicas que transformarán la economía en los próximos años',
          startsAt: '2025-11-15T10:30:00Z',
          endsAt: '2025-11-15T12:00:00Z',
          isLive: false,
          speakers: [1, 2],
          isFavorited: true,
        },
      ]);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const toggleFavorite = async (sessionId: number) => {
    try {
      // TODO: Implement API call to toggle favorite
      console.log('Toggling favorite for session:', sessionId);
      
      setFavoriteSessions(prev =>
        prev.map(session =>
          session.id === sessionId
            ? { ...session, isFavorited: !session.isFavorited }
            : session
        ).filter(session => session.isFavorited)
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderSessionCard = (session: FavoriteSession) => (
    <TouchableOpacity
      key={session.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => router.push(`/session/${session.id}`)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          {session.isLive && (
            <View className="flex-row items-center mb-2">
              <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              <Text className="text-red-500 font-semibold text-xs uppercase">
                EN VIVO
              </Text>
            </View>
          )}
          
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {session.title}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => toggleFavorite(session.id)}
          className="p-2"
        >
          <Heart
            size={20}
            color={session.isFavorited ? '#ef4444' : '#9ca3af'}
            fill={session.isFavorited ? '#ef4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      
      <Text className="text-gray-600 mb-4 text-sm leading-5">
        {session.description}
      </Text>
      
      <View className="flex-row items-center mb-3">
        <Calendar size={14} color="#6b7280" />
        <Text className="text-gray-500 text-sm ml-1 capitalize">
          {formatDate(session.startsAt)}
        </Text>
      </View>
      
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Clock size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
          </Text>
        </View>
        
        {session.speakers.length > 0 && (
          <View className="flex-row items-center">
            <Users size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">
              {session.speakers.length} speaker{session.speakers.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Mis Favoritos
          </Text>
          
          {favoriteSessions.length > 0 ? (
            favoriteSessions.map(renderSessionCard)
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Heart size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4 text-lg font-medium">
                No tienes sesiones favoritas
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                Explora las sesiones y marca tus favoritas tocando el corazón
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/sections')}
                className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  Explorar Sesiones
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}