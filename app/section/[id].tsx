import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Calendar, 
  Clock, 
  ChevronLeft,
  ExternalLink,
  Users,
  Play
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

interface SectionDetail {
  id: number;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  sessions: any[];
}

export default function SectionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [section, setSection] = useState<SectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const getBackgroundGradient = () => {
    if (colorScheme === "dark") {
      return ['rgb(45,60,150)', 'rgb(35,45,120)', 'rgb(25,35,90)'];
    } else {
      return ['#f53b43', 'rgb(255,217,224)', 'rgb(255,255,255)'];
    }
  };

  useEffect(() => {
    loadSection();
  }, [id]);

  const loadSection = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to load section details
      console.log('Loading section:', id);
      // Mock data for now
      setSection({
        id: parseInt(id),
        name: 'Transformación Digital',
        description: 'Esta sección del evento está dedicada a explorar el impacto transformador de la tecnología en los negocios modernos. Analizaremos cómo las empresas están adoptando nuevas tecnologías para revolucionar sus operaciones, mejorar la experiencia del cliente y crear ventajas competitivas sostenibles.\n\nA través de casos de éxito reales y discusiones estratégicas, los participantes podrán comprender las mejores prácticas para liderar procesos de transformación digital exitosos, identificar oportunidades de innovación y superar los desafíos más comunes en la implementación tecnológica.\n\nEsta sección incluye presentaciones magistrales, paneles de discusión y sesiones interactivas que proporcionarán insights valiosos para ejecutivos que buscan acelerar la digitalización de sus organizaciones.',
        startsAt: '2025-11-15T10:30:00Z',
        endsAt: '2025-11-15T15:30:00Z',
        sessions: [
          {
            id: 1,
            title: 'El futuro de la economía digital',
            description: 'Un análisis profundo de cómo la transformación digital está revolucionando los modelos de negocio',
            startsAt: '2025-11-15T10:30:00Z',
            endsAt: '2025-11-15T12:00:00Z',
            isLive: false,
            speakers: [
              { id: 1, name: 'María González', company: 'TechCorp Perú' },
              { id: 2, name: 'Carlos Rodríguez', company: 'StartupHub' },
            ],
          },
          {
            id: 2,
            title: 'Innovación y liderazgo empresarial',
            description: 'Estrategias para liderar la innovación en organizaciones del siglo XXI',
            startsAt: '2025-11-15T14:00:00Z',
            endsAt: '2025-11-15T15:30:00Z',
            isLive: false,
            speakers: [
              { id: 1, name: 'María González', company: 'TechCorp Perú' },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error loading section:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la sección');
    } finally {
      setLoading(false);
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

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: colors.textTertiary }}>Cargando sección...</Text>
      </SafeAreaView>
    );
  }

  if (!section) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: colors.textTertiary }}>Sección no encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.buttonPrimary }}
          className="mt-4 px-6 py-2 rounded-lg"
        >
          <Text style={{ color: colors.buttonPrimaryText }} className="font-semibold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={getBackgroundGradient()}
      locations={colorScheme === "dark" ? [0, 0.5, 1] : [0, 0.2, 1]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: colors.background, borderBottomColor: colors.border }} className="px-6 py-6 border-b">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <ChevronLeft size={24} color={colors.text} />
            <Text style={{ color: colors.text }} className="ml-2 font-medium">Volver</Text>
          </TouchableOpacity>

          <Text style={{ color: colors.text }} className="text-2xl font-bold mb-3">
            {section.name}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary }} className="ml-2 capitalize">
              {formatDate(section.startsAt)}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <Clock size={16} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary }} className="ml-2">
              {formatTime(section.startsAt)} - {formatTime(section.endsAt)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Play size={16} color={colors.textTertiary} />
            <Text style={{ color: colors.textSecondary }} className="ml-2">
              Duración: {getDuration(section.startsAt, section.endsAt)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={{ backgroundColor: colors.background }} className="px-6 py-6 mt-4">
          <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
            Descripción
          </Text>
          <Text style={{ color: colors.textSecondary }} className="leading-6">
            {section.description}
          </Text>
        </View>

        {/* Sessions */}
        {section.sessions.length > 0 && (
          <View style={{ backgroundColor: colors.background }} className="px-6 py-6 mt-4">
            <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
              Sesiones ({section.sessions.length})
            </Text>
            
            {section.sessions.map((session, index) => (
              <TouchableOpacity
                key={session.id}
                style={{ 
                  backgroundColor: colors.cardAccent, 
                  borderColor: colors.cardBorder 
                }}
                className="rounded-xl p-4 mb-4 border"
                onPress={() => router.push(`/session/${session.id}`)}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 mr-3">
                    <Text style={{ color: colors.text }} className="text-lg font-bold mb-1">
                      {session.title}
                    </Text>
                    
                    {session.isLive && (
                      <View className="flex-row items-center mb-2">
                        <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <Text className="text-red-500 font-semibold text-sm uppercase">
                          EN VIVO
                        </Text>
                      </View>
                    )}
                    
                    <Text style={{ color: colors.textSecondary }} className="text-sm leading-5 mb-3">
                      {session.description}
                    </Text>
                  </View>
                  <ExternalLink size={20} color={colors.textTertiary} />
                </View>
                
                <View style={{ borderTopColor: colors.border }} className="flex-row items-center justify-between pt-3 border-t">
                  <View className="flex-row items-center">
                    <Clock size={14} color={colors.textTertiary} />
                    <Text style={{ color: colors.textTertiary }} className="text-sm ml-1">
                      {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={{ color: colors.textTertiary }} className="text-sm ml-1">
                      {session.speakers.length} speaker{session.speakers.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Speakers */}
                {session.speakers.length > 0 && (
                  <View style={{ borderTopColor: colors.border }} className="mt-3 pt-3 border-t">
                    <Text style={{ color: colors.text }} className="font-medium text-sm mb-2">
                      Speakers:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {session.speakers.map((speaker: any, speakerIndex: number) => (
                        <TouchableOpacity
                          key={speaker.id}
                          style={{ 
                            backgroundColor: colors.background, 
                            borderColor: colors.border 
                          }}
                          className="px-3 py-1 rounded-full mr-2 mb-2 border"
                          onPress={() => router.push(`/speaker/${speaker.id}`)}
                        >
                          <Text style={{ color: colors.text }} className="text-xs">
                            {speaker.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View className="px-6 py-6 mt-4">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/sections')}
            style={{ backgroundColor: colors.buttonSecondary }}
            className="py-4 px-6 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Calendar size={20} color={colors.buttonSecondaryText} />
              <Text style={{ color: colors.buttonSecondaryText }} className="font-semibold ml-2">
                Ver todas las secciones
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}