import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Heart, 
  Clock, 
  Calendar, 
  Users, 
  MapPin, 
  FileText, 
  MessageCircle,
  Share
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface SessionDetail {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isLive: boolean;
  showDetails: boolean;
  hasQuestions: boolean;
  isFavorited: boolean;
  speakers: any[];
  section: {
    id: number;
    name: string;
  };
  documents?: any[];
  summary?: string;
}

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to load session details
      console.log('Loading session:', id);
      // Mock data for now
      setSession({
        id: parseInt(id),
        title: 'El futuro de la economía digital',
        description: 'Un análisis profundo de cómo la transformación digital está revolucionando los modelos de negocio tradicionales y creando nuevas oportunidades en el mercado peruano. Exploraremos las tendencias emergentes, los desafíos regulatorios y las estrategias de adaptación para empresas de todos los tamaños.',
        startsAt: '2025-11-15T10:30:00Z',
        endsAt: '2025-11-15T12:00:00Z',
        isLive: false,
        showDetails: true,
        hasQuestions: true,
        isFavorited: false,
        speakers: [
          {
            id: 1,
            name: 'María González',
            position: 'CEO',
            company: 'TechCorp Perú',
            image: null,
          },
          {
            id: 2,
            name: 'Carlos Rodríguez',
            position: 'Director de Innovación',
            company: 'StartupHub',
            image: null,
          },
        ],
        section: {
          id: 2,
          name: 'Transformación Digital',
        },
        documents: [
          {
            id: 1,
            name: 'Presentación - Economía Digital 2025',
            type: 'PDF',
            size: '2.5 MB',
          },
        ],
        summary: 'En esta sesión se abordaron los principales desafíos y oportunidades de la economía digital...',
      });
    } catch (error) {
      console.error('Error loading session:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la sesión');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!session) return;
    
    try {
      // TODO: Implement API call to toggle favorite
      console.log('Toggling favorite for session:', session.id);
      setSession(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  const shareSession = async () => {
    if (!session) return;
    
    try {
      // TODO: Implement sharing functionality
      console.log('Sharing session:', session.title);
      Alert.alert('Compartir', 'Funcionalidad de compartir próximamente');
    } catch (error) {
      console.error('Error sharing session:', error);
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Cargando sesión...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Sesión no encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-semibold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          {session.isLive && (
            <View className="flex-row items-center mb-3">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <Text className="text-red-500 font-semibold text-sm uppercase">
                EN VIVO
              </Text>
            </View>
          )}
          
          <Text className="text-2xl font-bold text-gray-800 mb-3">
            {session.title}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-2 capitalize">
              {formatDate(session.startsAt)}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <Clock size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-2">
              {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
            </Text>
          </View>
          
          {/* Actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={toggleFavorite}
              className="flex-row items-center px-4 py-2 bg-gray-100 rounded-lg"
            >
              <Heart
                size={18}
                color={session.isFavorited ? '#ef4444' : '#6b7280'}
                fill={session.isFavorited ? '#ef4444' : 'transparent'}
              />
              <Text className="ml-2 text-gray-700 font-medium">
                {session.isFavorited ? 'Favorito' : 'Favorito'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={shareSession}
              className="flex-row items-center px-4 py-2 bg-gray-100 rounded-lg"
            >
              <Share size={18} color="#6b7280" />
              <Text className="ml-2 text-gray-700 font-medium">Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white px-6 py-6 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Descripción
          </Text>
          <Text className="text-gray-600 leading-6">
            {session.description}
          </Text>
        </View>

        {/* Speakers */}
        {session.speakers.length > 0 && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Speakers
            </Text>
            {session.speakers.map((speaker, index) => (
              <TouchableOpacity
                key={speaker.id}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
                onPress={() => router.push(`/speaker/${speaker.id}`)}
              >
                <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-4">
                  <Users size={20} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    {speaker.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {speaker.position} - {speaker.company}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Documents */}
        {session.documents && session.documents.length > 0 && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Documentos
            </Text>
            {session.documents.map((doc, index) => (
              <TouchableOpacity
                key={doc.id}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
                  <FileText size={20} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    {doc.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {doc.type} • {doc.size}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Summary */}
        {session.summary && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Resumen
            </Text>
            <Text className="text-gray-600 leading-6">
              {session.summary}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View className="px-6 py-6 mt-4">
          {session.hasQuestions && (
            <TouchableOpacity className="bg-blue-600 py-4 px-6 rounded-lg mb-3">
              <View className="flex-row items-center justify-center">
                <MessageCircle size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Hacer una pregunta
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => router.push(`/section/${session.section.id}`)}
            className="bg-gray-100 py-4 px-6 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Calendar size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">
                Ver más de {session.section.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}