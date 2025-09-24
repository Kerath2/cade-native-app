import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
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
  Share,
  ChevronDown,
  ChevronUp,
  ChevronLeft
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { sessionsApi } from '@/services/api/sessions';
import { sectionsApi } from '@/services/api/sections';
import Colors from '@/constants/Colors';
import { formatPeruTime } from '@/utils/formatPeruTime';
import { Section } from '@/types';

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
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    setLoading(true);
    try {
      console.log('Loading session:', id);

      // Load sections and session data in parallel
      const [sessionData, sectionsData] = await Promise.all([
        sessionsApi.getSessionById(parseInt(id)),
        sectionsApi.getSections()
      ]);

      console.log('Session data:', sessionData);
      console.log('Session section:', sessionData.section);
      console.log('Session sectionId:', sessionData.sectionId);
      console.log('Available sections:', sectionsData);

      setSections(sectionsData);

      // Transform the API response to match our interface
      const transformedSession: SessionDetail = {
        id: sessionData.id,
        title: sessionData.title,
        description: sessionData.description || '',
        startsAt: sessionData.startsAt,
        endsAt: sessionData.endsAt || sessionData.startsAt,
        isLive: sessionData.isLive ?? false,
        showDetails: sessionData.showDetails ?? true,
        hasQuestions: sessionData.hasQuestions ?? false,
        isFavorited: false, // TODO: Get user's favorite status from API
        speakers: (sessionData.speakerSessions || []).map(speakerSession => {
          const speaker = {
            id: speakerSession.speaker.id,
            name: `${speakerSession.speaker.name} ${speakerSession.speaker.lastName}`,
            position: speakerSession.speaker.position,
            company: speakerSession.speaker.country, // Using country as company fallback
            image: speakerSession.speaker.picture,
          };
          console.log(`Speaker ${speaker.name} image URL:`, speaker.image);
          return speaker;
        }),
        section: (() => {
          // First check if we have direct section data
          if (sessionData.section) {
            return {
              id: sessionData.section.id,
              name: sessionData.section.title,
            };
          }

          // Check if we have sectionId
          if (sessionData.sectionId) {
            const foundSection = sectionsData.find(section => section.id === sessionData.sectionId);
            if (foundSection) {
              return {
                id: foundSection.id,
                name: foundSection.title,
              };
            }
          }

          // Try to infer section based on session date range
          const sessionDate = new Date(sessionData.startsAt);
          const matchingSection = sectionsData.find(section => {
            const sectionStart = new Date(section.startsAt);
            const sectionEnd = new Date(section.endsAt);
            return sessionDate >= sectionStart && sessionDate <= sectionEnd;
          });

          if (matchingSection) {
            console.log('Inferred section for session:', matchingSection.title);
            return {
              id: matchingSection.id,
              name: matchingSection.title,
            };
          }

          // Fallback to "Sin sección"
          return {
            id: 0,
            name: 'Sin sección',
          };
        })(),
        documents: sessionData.documents || [],
        summary: sessionData.summaries && sessionData.summaries.length > 0
          ? sessionData.summaries[0].content
          : undefined,
      };

      setSession(transformedSession);
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


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Lima',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: Colors.textTertiary }}>Cargando sesión...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: Colors.textTertiary }}>Sesión no encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: Colors.buttonPrimary }}
          className="mt-4 px-6 py-2 rounded-lg"
        >
          <Text style={{ color: Colors.buttonPrimaryText }} className="font-semibold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#eff3f6" }}
    >
      <View style={{ backgroundColor: "#2c3c94" }}>
        <SafeAreaView style={{ backgroundColor: "#2c3c94" }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#2c3c94"
            translucent={false}
          />
          <View style={{ height: 30 }} />
        </SafeAreaView>
      </View>
      <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4 mt-4"
        >
          <ChevronLeft size={24} color="#2c3c94" />
          <Text style={{ color: "#2c3c94" }} className="ml-2 font-medium">
            Volver
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            marginTop: 16,
          }}
        >
          {session.isLive && (
            <View className="flex-row items-center mb-3">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <Text className="text-red-500 font-semibold text-sm uppercase">
                EN VIVO
              </Text>
            </View>
          )}
          
          <Text style={{ color: Colors.text }} className="text-2xl font-bold mb-3">
            {session.title}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#2c3c94" />
            <Text style={{ color: "#2c3c94", fontWeight: "500" }} className="ml-2 capitalize">
              {formatDate(session.startsAt)}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <Clock size={16} color="#2c3c94" />
            <Text style={{ color: "#2c3c94", fontWeight: "500" }} className="ml-2">
              {formatPeruTime(session.startsAt)} - {formatPeruTime(session.endsAt)}
            </Text>
          </View>
          
          {/* Actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={toggleFavorite}
              style={{ backgroundColor: "white" }}
              className="flex-row items-center px-4 py-2 rounded-lg"
            >
              <Heart
                size={18}
                color={session.isFavorited ? '#f43c44' : Colors.textTertiary}
                fill={session.isFavorited ? '#f43c44' : 'transparent'}
              />
              <Text style={{ color: Colors.text }} className="ml-2 font-medium">
                {session.isFavorited ? 'Favorito' : 'Favorito'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={shareSession}
              style={{ backgroundColor: "white" }}
              className="flex-row items-center px-4 py-2 rounded-lg"
            >
              <Share size={18} color={Colors.textTertiary} />
              <Text style={{ color: Colors.text }} className="ml-2 font-medium">Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="flex-row items-center justify-between mb-3"
          >
            <Text style={{ color: "#000000" }} className="text-lg font-semibold">
              Descripción
            </Text>
            {isDescriptionExpanded ? (
              <ChevronUp size={20} color={Colors.text} />
            ) : (
              <ChevronDown size={20} color={Colors.text} />
            )}
          </TouchableOpacity>
          
          <Text 
            style={{ color: Colors.textSecondary }} 
            className="leading-6"
            numberOfLines={isDescriptionExpanded ? undefined : 12}
          >
            {session.description}
          </Text>
        </View>

        {/* Speakers */}
        {session.speakers.length > 0 && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              marginTop: 16,
            }}
          >
            <Text style={{ color: "#000000" }} className="text-lg font-semibold mb-4">
              Speakers
            </Text>
            {session.speakers.map((speaker, index) => (
              <TouchableOpacity
                key={speaker.id}
                style={{ borderBottomColor: Colors.border }}
                className="flex-row items-center py-3 border-b last:border-b-0"
                onPress={() => router.push(`/speaker/${speaker.id}`)}
              >
                {speaker.image ? (
                  <Image
                    source={{ uri: speaker.image }}
                    className="w-12 h-12 rounded-full mr-4"
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    resizeMode="cover"
                    onError={() => {
                      console.log(`Failed to load image for speaker: ${speaker.name}`);
                    }}
                  />
                ) : (
                  <View style={{ backgroundColor: Colors.backgroundTertiary }} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                    <Users size={20} color={Colors.textTertiary} />
                  </View>
                )}
                <View className="flex-1">
                  <Text style={{ color: Colors.text }} className="font-semibold">
                    {speaker.name}
                  </Text>
                  <Text style={{ color: Colors.textSecondary }} className="text-sm">
                    {speaker.position} - {speaker.company}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Documents */}
        {session.documents && session.documents.length > 0 && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              marginTop: 16,
            }}
          >
            <Text style={{ color: "#000000" }} className="text-lg font-semibold mb-4">
              Documentos
            </Text>
            {session.documents.map((doc, index) => (
              <TouchableOpacity
                key={doc.id}
                style={{ borderBottomColor: Colors.border }}
                className="flex-row items-center py-3 border-b last:border-b-0"
              >
                <View style={{ backgroundColor: Colors.backgroundTertiary }} className="w-12 h-12 rounded-lg items-center justify-center mr-4">
                  <FileText size={20} color={Colors.textTertiary} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: Colors.text }} className="font-semibold">
                    {doc.name}
                  </Text>
                  <Text style={{ color: Colors.textSecondary }} className="text-sm">
                    {doc.type} • {doc.size}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Summary */}
        {session.summary && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              marginTop: 16,
            }}
          >
            <Text style={{ color: "#000000" }} className="text-lg font-semibold mb-3">
              Resumen
            </Text>
            <Text style={{ color: Colors.textSecondary }} className="leading-6">
              {session.summary}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View className="px-6 py-6 mt-4">
          {session.hasQuestions && (
            <TouchableOpacity style={{ backgroundColor: Colors.buttonPrimary }} className="py-4 px-6 rounded-lg mb-3">
              <View className="flex-row items-center justify-center">
                <MessageCircle size={20} color={Colors.buttonPrimaryText} />
                <Text style={{ color: Colors.buttonPrimaryText }} className="font-semibold ml-2">
                  Hacer una pregunta
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => router.push(`/section/${session.section.id}`)}
            style={{ backgroundColor: "#2c3c94" }}
            className="py-4 px-6 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Calendar size={20} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF" }} className="font-semibold ml-2">
                Ver más de {session.section.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </View>
  );
}
