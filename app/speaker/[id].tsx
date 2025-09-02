import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import Colors from '@/constants/Colors';

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
    if (speaker.isHost) return {
      bg: colors.error + '20',
      text: colors.error
    };
    if (speaker.isCommittee) return {
      bg: colors.success + '20',
      text: colors.success
    };
    return {
      bg: colors.primary + '20',
      text: colors.primary
    };
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: colors.textTertiary }}>Cargando speaker...</Text>
      </SafeAreaView>
    );
  }

  if (!speaker) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }} className="justify-center items-center">
        <Text style={{ color: colors.textTertiary }}>Speaker no encontrado</Text>
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

  const typeColors = getTypeColor(speaker);
  
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

          <View className="flex-row items-start">
            <View className="mr-4">
              {speaker.picture ? (
                <Image
                  source={{ uri: speaker.picture }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View style={{ backgroundColor: colors.backgroundTertiary }} className="w-24 h-24 rounded-full items-center justify-center">
                  <User size={32} color={colors.textTertiary} />
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text style={{ color: colors.text }} className="text-2xl font-bold mb-2">
                {speaker.name} {speaker.lastName}
              </Text>
              
              <Text style={{ color: colors.textSecondary }} className="text-lg mb-2">
                {speaker.position}
              </Text>
              
              <View className="flex-row items-center mb-3">
                <Building size={16} color={colors.textTertiary} />
                <Text style={{ color: colors.textTertiary }} className="ml-2">
                  {speaker.country}
                </Text>
              </View>

              <View style={{ backgroundColor: typeColors.bg }} className="self-start px-3 py-1 rounded-full">
                <Text style={{ color: typeColors.text }} className="text-sm font-semibold">
                  {getTypeText(speaker)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Biography */}
        <View style={{ backgroundColor: colors.background }} className="px-6 py-6 mt-4">
          <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
            Biografía
          </Text>
          <Text style={{ color: colors.textSecondary }} className="leading-6">
            {speaker.bio}
          </Text>
        </View>

        {/* Sessions */}
        {speaker.speakerSessions && speaker.speakerSessions.length > 0 && (
          <View style={{ backgroundColor: colors.background }} className="px-6 py-6 mt-4">
            <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
              Sesiones
            </Text>
            {speaker.speakerSessions.map((speakerSession, index) => (
              <TouchableOpacity
                key={speakerSession.session.id}
                style={{ borderBottomColor: colors.border }}
                className="py-4 border-b last:border-b-0"
                onPress={() => router.push(`/session/${speakerSession.session.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text style={{ color: colors.text }} className="font-semibold mb-1">
                      {speakerSession.session.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Calendar size={14} color={colors.textTertiary} />
                      <Text style={{ color: colors.textTertiary }} className="text-sm ml-1">
                        {formatDate(speakerSession.session.startsAt)} • {formatTime(speakerSession.session.startsAt)} - {formatTime(speakerSession.session.endsAt)}
                      </Text>
                    </View>
                  </View>
                  <ExternalLink size={16} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View className="px-6 py-6 mt-4">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/speakers')}
            style={{ backgroundColor: colors.buttonSecondary }}
            className="py-4 px-6 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <User size={20} color={colors.buttonSecondaryText} />
              <Text style={{ color: colors.buttonSecondaryText }} className="font-semibold ml-2">
                Ver todos los speakers
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}