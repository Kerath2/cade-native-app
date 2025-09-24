import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ExternalLink,
  Users,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { sectionsApi } from "@/services/api/sections";
import Colors from "@/constants/Colors";
import { formatPeruTime } from "@/utils/formatPeruTime";

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    loadSection();
  }, [id]);

  const loadSection = async () => {
    setLoading(true);
    try {
      console.log("Loading section:", id);
      const sectionData = await sectionsApi.getSectionById(parseInt(id));

      // Transform the API response to match our interface
      const transformedSection: SectionDetail = {
        id: sectionData.id,
        name: sectionData.title,
        description: sectionData.description || '',
        startsAt: sectionData.startsAt,
        endsAt: sectionData.endsAt,
        sessions: (sectionData.sessions || []).map(session => ({
          id: session.id,
          title: session.title,
          description: session.description || '',
          startsAt: session.startsAt,
          endsAt: session.endsAt || session.startsAt,
          isLive: session.isLive,
          speakers: (session.speakerSessions || []).map(speakerSession => ({
            id: speakerSession.speaker.id,
            name: `${speakerSession.speaker.name} ${speakerSession.speaker.lastName}`,
            company: speakerSession.speaker.country,
          })),
        })),
      };

      setSection(transformedSection);
    } catch (error) {
      console.error("Error loading section:", error);
      Alert.alert("Error", "No se pudo cargar la información de la sección");
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Lima",
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMinutes = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60),
    );
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        className="justify-center items-center"
      >
        <Text style={{ color: Colors.textTertiary }}>Cargando sección...</Text>
      </SafeAreaView>
    );
  }

  if (!section) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        className="justify-center items-center"
      >
        <Text style={{ color: Colors.textTertiary }}>
          Sección no encontrada
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: Colors.buttonPrimary }}
          className="mt-4 px-6 py-2 rounded-lg"
        >
          <Text
            style={{ color: Colors.buttonPrimaryText }}
            className="font-semibold"
          >
            Volver
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eff3f6" }}>
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
            <ChevronLeft size={24} color={"#2c3c94"} />
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
            }}
          >
            <Text
              style={{ color: Colors.text }}
              className="text-2xl font-bold mb-3"
            >
              {section.name}
            </Text>

            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#2c3c94" />
              <Text
                style={{ color: "#2c3c94", fontWeight: "500" }}
                className="ml-2 capitalize"
              >
                {formatDate(section.startsAt)}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#2c3c94" />
              <Text style={{ color: "#2c3c94", fontWeight: "500" }} className="ml-2">
                {formatPeruTime(section.startsAt)} - {formatPeruTime(section.endsAt)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Play size={16} color="#2c3c94" />
              <Text style={{ color: "#2c3c94", fontWeight: "500" }} className="ml-2">
                Duración: {getDuration(section.startsAt, section.endsAt)}
              </Text>
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
              <Text
                style={{ color: "#000000" }}
                className="text-lg font-semibold"
              >
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
              {section.description}
            </Text>
          </View>

          {/* Sessions */}
          {section.sessions.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text
                style={{ color: Colors.text }}
                className="text-lg font-semibold mb-4"
              >
                Sesiones ({section.sessions.length})
              </Text>

              {section.sessions.map((session, index) => (
                <TouchableOpacity
                  key={session.id}
                  className="mb-4"
                  onPress={() => router.push(`/session/${session.id}`)}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: Colors.cardBorder,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1 mr-3">
                        <Text
                          style={{ color: Colors.text }}
                          className="text-lg font-bold mb-1"
                        >
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

                        <Text
                          style={{ color: Colors.textSecondary }}
                          className="text-sm leading-5 mb-3"
                        >
                          {session.description}
                        </Text>
                      </View>
                      <ExternalLink size={20} color="#f43c44" />
                    </View>

                    <View
                      style={{ borderTopColor: Colors.border }}
                      className="flex-row items-center justify-between pt-3 border-t"
                    >
                      <View className="flex-row items-center">
                        <Clock size={14} color="#2c3c94" />
                        <Text
                          style={{ color: "#2c3c94", fontWeight: "500" }}
                          className="text-sm ml-1"
                        >
                          {formatPeruTime(session.startsAt)} -{" "}
                          {formatPeruTime(session.endsAt)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Users size={14} color="#f43c44" />
                        <Text
                          style={{ color: "#f43c44", fontWeight: "500" }}
                          className="text-sm ml-1"
                        >
                          {session.speakers.length} speaker
                          {session.speakers.length > 1 ? "s" : ""}
                        </Text>
                      </View>
                    </View>

                    {/* Speakers */}
                    {session.speakers.length > 0 && (
                      <View
                        style={{ borderTopColor: Colors.border }}
                        className="mt-3 pt-3 border-t"
                      >
                        <Text
                          style={{ color: Colors.text }}
                          className="font-medium text-sm mb-2"
                        >
                          Speakers:
                        </Text>
                        <View className="flex-row flex-wrap">
                          {session.speakers.map(
                            (speaker: any, speakerIndex: number) => (
                              <TouchableOpacity
                                key={`session-${index}-speaker-${speakerIndex}-${speaker.id}`}
                                style={{
                                  backgroundColor: "#2c3c94",
                                }}
                                className="px-3 py-1 rounded-full mr-2 mb-2"
                                onPress={() =>
                                  router.push(`/speaker/${speaker.id}`)
                                }
                              >
                                <Text
                                  style={{ color: "#FFFFFF" }}
                                  className="text-xs"
                                >
                                  {speaker.name}
                                </Text>
                              </TouchableOpacity>
                            ),
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Actions */}
          <View className="px-6 py-6 mt-4">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/sections")}
              style={{ backgroundColor: "#2c3c94" }}
              className="py-4 px-6 rounded-lg"
            >
              <View className="flex-row items-center justify-center">
                <Calendar size={20} color="#FFFFFF" />
                <Text
                  style={{ color: "#FFFFFF" }}
                  className="font-semibold ml-2"
                >
                  Ver todas las secciones
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
