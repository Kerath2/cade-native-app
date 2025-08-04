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
  User, 
  Building, 
  Mail, 
  Calendar, 
  ChevronLeft,
  ExternalLink 
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { speakersApi } from '@/services/api';
import { Speaker } from '@/types';

interface SpeakerDetail extends Speaker {
  speakerSessions?: {
    session: {
      id: number;
      title: string;
      startsAt: string;
      endsAt: string;
    };
  }[];
}

export default function SpeakerDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [speaker, setSpeaker] = useState<SpeakerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpeaker();
  }, [id]);

  const loadSpeaker = async () => {
    setLoading(true);
    try {
      console.log('Loading speaker from API:', id);
      const speakerData = await speakersApi.getSpeakerById(parseInt(id));
      setSpeaker(speakerData);
    } catch (error) {
      console.error('Error loading speaker:', error);
      Alert.alert('Error', 'No se pudo cargar la información del speaker');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (speaker: Speaker) => {
    if (speaker.isHost) return 'bg-red-100 text-red-800';
    if (speaker.isCommittee) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getTypeText = (speaker: Speaker) => {
    if (speaker.isHost) return 'Anfitrión';
    if (speaker.isCommittee) return 'Comité';
    return 'Speaker';
  };

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return "00:00";
      
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "00:00";
      }
      
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Formato 24 horas
      });
    } catch (error) {
      console.error("Error formatting time:", error, dateString);
      return "00:00";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Cargando speaker...</Text>
      </SafeAreaView>
    );
  }

  if (!speaker) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Speaker no encontrado</Text>
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
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <ChevronLeft size={24} color="#374151" />
            <Text className="text-gray-700 ml-2 font-medium">Volver</Text>
          </TouchableOpacity>

          <View className="flex-row items-start">
            <View className="mr-4">
              {speaker.picture ? (
                <Image
                  source={{ uri: speaker.picture }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <User size={32} color="#6b7280" />
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {speaker.name} {speaker.lastName}
              </Text>
              
              <Text className="text-gray-600 text-lg mb-2">
                {speaker.position}
              </Text>
              
              <View className="flex-row items-center mb-3">
                <Building size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2">
                  {speaker.country}
                </Text>
              </View>

              <View className={`self-start px-3 py-1 rounded-full ${getTypeColor(speaker)}`}>
                <Text className={`text-sm font-semibold ${getTypeColor(speaker).split(' ')[1]}`}>
                  {getTypeText(speaker)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biography */}
        <View className="bg-white px-6 py-6 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Biografía
          </Text>
          <Text className="text-gray-600 leading-6">
            {speaker.bio}
          </Text>
        </View>

        {/* Sessions */}
        {speaker.speakerSessions && speaker.speakerSessions.length > 0 && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Sesiones
            </Text>
            {speaker.speakerSessions.map((speakerSession, index) => (
              <TouchableOpacity
                key={speakerSession.session.id}
                className="py-4 border-b border-gray-100 last:border-b-0"
                onPress={() => router.push(`/session/${speakerSession.session.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-800 font-semibold mb-1">
                      {speakerSession.session.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {formatDate(speakerSession.session.startsAt)} • {formatTime(speakerSession.session.startsAt)} - {formatTime(speakerSession.session.endsAt)}
                      </Text>
                    </View>
                  </View>
                  <ExternalLink size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View className="px-6 py-6 mt-4">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/speakers')}
            className="bg-gray-100 py-4 px-6 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <User size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">
                Ver todos los speakers
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}