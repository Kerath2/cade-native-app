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
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, LogOut } from 'lucide-react-native';

interface Session {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isLive: boolean;
  speakers: any[];
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to load sessions
      console.log('Loading sessions...');
      // Mock data for now
      setSessions([
        {
          id: 1,
          title: 'Apertura CADE Ejecutivos 2025',
          description: 'Ceremonia de apertura del evento',
          startsAt: '2025-11-15T09:00:00Z',
          endsAt: '2025-11-15T10:00:00Z',
          isLive: true,
          speakers: [],
        },
        {
          id: 2,
          title: 'El futuro de la economía digital',
          description: 'Análisis de las tendencias tecnológicas',
          startsAt: '2025-11-15T10:30:00Z',
          endsAt: '2025-11-15T12:00:00Z',
          isLive: false,
          speakers: [],
        },
      ]);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSessionCard = (session: Session) => (
    <TouchableOpacity
      key={session.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => router.push(`/session/${session.id}`)}
    >
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
      
      <Text className="text-gray-600 mb-3 text-sm leading-5">
        {session.description}
      </Text>
      
      <View className="flex-row items-center justify-between">
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
        {/* Header */}
        <View className="bg-blue-600 px-6 py-8 rounded-b-3xl">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                ¡Hola, {user?.name?.split(' ')[0]}!
              </Text>
              <Text className="text-blue-100 text-base">
                Bienvenido a CADE Ejecutivos 2025
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="p-2 bg-blue-700 rounded-lg"
            >
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-6">
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="flex-1 bg-white p-4 rounded-xl mr-2 items-center shadow-sm"
              onPress={() => router.push('/(tabs)/sections')}
            >
              <Calendar size={24} color="#2563eb" />
              <Text className="text-gray-800 font-semibold mt-2 text-center">
                Secciones
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-white p-4 rounded-xl mx-1 items-center shadow-sm"
              onPress={() => router.push('/(tabs)/speakers')}
            >
              <Users size={24} color="#2563eb" />
              <Text className="text-gray-800 font-semibold mt-2 text-center">
                Speakers
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-white p-4 rounded-xl ml-2 items-center shadow-sm"
              onPress={() => router.push('/(tabs)/chat')}
            >
              <MapPin size={24} color="#2563eb" />
              <Text className="text-gray-800 font-semibold mt-2 text-center">
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sessions */}
        <View className="px-6 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Sesiones de Hoy
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/sections')}>
              <Text className="text-blue-600 font-semibold">
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          
          {sessions.length > 0 ? (
            sessions.map(renderSessionCard)
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Calendar size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4">
                No hay sesiones programadas para hoy
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
