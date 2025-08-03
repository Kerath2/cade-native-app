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

interface SpeakerDetail {
  id: number;
  name: string;
  position?: string;
  company?: string;
  bio?: string;
  image?: string;
  email?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  role: 'SPEAKER' | 'MODERATOR' | 'PANELIST';
  sessions: any[];
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
      // TODO: Implement API call to load speaker details
      console.log('Loading speaker:', id);
      // Mock data for now
      setSpeaker({
        id: parseInt(id),
        name: 'María González',
        position: 'CEO',
        company: 'TechCorp Perú',
        bio: 'María González es una líder empresarial reconocida con más de 15 años de experiencia en transformación digital y gestión estratégica. Ha dirigido múltiples iniciativas de innovación tecnológica en el sector corporativo peruano, siendo pionera en la implementación de soluciones digitales que han revolucionado los procesos empresariales tradicionales.\n\nCon una sólida formación en ingeniería de sistemas y un MBA en gestión estratégica, María ha liderado equipos multidisciplinarios en proyectos de gran envergadura, logrando incrementos significativos en la eficiencia operacional y la satisfacción del cliente.\n\nActualmente, como CEO de TechCorp Perú, está enfocada en desarrollar un ecosistema tecnológico sostenible que impulse el crecimiento económico del país a través de la innovación y la digitalización empresarial.',
        email: 'maria.gonzalez@techcorp.pe',
        gender: 'FEMALE',
        role: 'SPEAKER',
        sessions: [
          {
            id: 1,
            title: 'El futuro de la economía digital',
            startsAt: '2025-11-15T10:30:00Z',
            endsAt: '2025-11-15T12:00:00Z',
          },
          {
            id: 3,
            title: 'Innovación y liderazgo empresarial',
            startsAt: '2025-11-15T16:00:00Z',
            endsAt: '2025-11-15T17:30:00Z',
          },
        ],
      });
    } catch (error) {
      console.error('Error loading speaker:', error);
      Alert.alert('Error', 'No se pudo cargar la información del speaker');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SPEAKER':
        return 'bg-blue-100 text-blue-800';
      case 'MODERATOR':
        return 'bg-green-100 text-green-800';
      case 'PANELIST':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'SPEAKER':
        return 'Speaker';
      case 'MODERATOR':
        return 'Moderador';
      case 'PANELIST':
        return 'Panelista';
      default:
        return role;
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
              {speaker.image ? (
                <Image
                  source={{ uri: speaker.image }}
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
                {speaker.name}
              </Text>
              
              {speaker.position && (
                <Text className="text-gray-600 text-lg mb-2">
                  {speaker.position}
                </Text>
              )}
              
              {speaker.company && (
                <View className="flex-row items-center mb-3">
                  <Building size={16} color="#6b7280" />
                  <Text className="text-gray-500 ml-2">
                    {speaker.company}
                  </Text>
                </View>
              )}

              <View className={`self-start px-3 py-1 rounded-full ${getRoleColor(speaker.role)}`}>
                <Text className={`text-sm font-semibold ${getRoleColor(speaker.role).split(' ')[1]}`}>
                  {getRoleText(speaker.role)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biography */}
        {speaker.bio && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Biografía
            </Text>
            <Text className="text-gray-600 leading-6">
              {speaker.bio}
            </Text>
          </View>
        )}

        {/* Contact */}
        {speaker.email && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Contacto
            </Text>
            <View className="flex-row items-center">
              <Mail size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-2">
                {speaker.email}
              </Text>
            </View>
          </View>
        )}

        {/* Sessions */}
        {speaker.sessions.length > 0 && (
          <View className="bg-white px-6 py-6 mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Sesiones
            </Text>
            {speaker.sessions.map((session, index) => (
              <TouchableOpacity
                key={session.id}
                className="py-4 border-b border-gray-100 last:border-b-0"
                onPress={() => router.push(`/session/${session.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-800 font-semibold mb-1">
                      {session.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {formatDate(session.startsAt)} • {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
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