import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  User,
  Building,
  Mail,
  Calendar,
  ChevronLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { speakersApi } from "@/services/api";
import { Speaker } from "@/types";
import Colors from "@/constants/Colors";
import { formatPeruTime } from "@/utils/formatPeruTime";

interface SpeakerDetail extends Speaker {
  speakerSessions?: {
    session: {
      id: number;
      title: string;
      startsAt: string;
      endsAt: string;
    } | null;
  }[];
}

export default function SpeakerDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [speaker, setSpeaker] = useState<SpeakerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBioExpanded, setIsBioExpanded] = useState(false);


  useEffect(() => {
    loadSpeaker();
  }, [id]);

  const loadSpeaker = async () => {
    setLoading(true);
    try {
      console.log("Loading speaker from API:", id);
      const speakerData = await speakersApi.getSpeakerById(parseInt(id));
      setSpeaker(speakerData);
    } catch (error) {
      console.error("Error loading speaker:", error);
      Alert.alert("Error", "No se pudo cargar la información del speaker");
    } finally {
      setLoading(false);
    }
  };


  const getTypeColor = (speaker: Speaker) => {
    if (speaker.isHost)
      return {
        bg: Colors.error + "20",
        text: Colors.error,
      };
    if (speaker.isCommittee)
      return {
        bg: Colors.success + "20",
        text: Colors.success,
      };
    return {
      bg: Colors.primary + "20",
      text: Colors.primary,
    };
  };

  const getTypeText = (speaker: Speaker) => {
    if (speaker.isHost) return "Anfitrión";
    if (speaker.isCommittee) return "Comité";
    return "Speaker";
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        className="justify-center items-center"
      >
        <Text style={{ color: Colors.textTertiary }}>Cargando speaker...</Text>
      </SafeAreaView>
    );
  }

  if (!speaker) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
        className="justify-center items-center"
      >
        <Text style={{ color: Colors.textTertiary }}>
          Speaker no encontrado
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

  const typeColors = getTypeColor(speaker);

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
        <ScrollView className="flex-1 px-6 rounded-lg">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4 mt-4"
          >
            <ChevronLeft size={24} color={Colors.text} />
            <Text style={{ color: Colors.text, fontFamily: 'Helvetica Neue' }} className="ml-2 font-medium">
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

            <View className="flex-row items-start">
              <View className="mr-4">
                {speaker.picture ? (
                  <Image
                    source={{ uri: speaker.picture }}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <View
                    style={{ backgroundColor: Colors.backgroundTertiary }}
                    className="w-24 h-24 rounded-full items-center justify-center"
                  >
                    <User size={32} color={Colors.textTertiary} />
                  </View>
                )}
              </View>

              <View className="flex-1">
                <Text
                  style={{ color: Colors.text, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
                  className="text-2xl font-bold mb-2"
                >
                  {speaker.name} {speaker.lastName}
                </Text>

                <Text
                  style={{ color: Colors.textSecondary, fontFamily: 'Helvetica Neue' }}
                  className="text-lg mb-2"
                >
                  {speaker.position}
                </Text>

                <View className="flex-row items-center mb-3">
                  <Building size={16} color={Colors.textTertiary} />
                  <Text style={{ color: Colors.textTertiary, fontFamily: 'Helvetica Neue' }} className="ml-2">
                    {speaker.country}
                  </Text>
                </View>

                <View
                  style={{ backgroundColor: speaker.isCommittee ? "rgb(0, 173, 238)" : "#2c3c94" }}
                  className="self-start px-3 py-1 rounded-full"
                >
                  <Text
                    style={{ color: "#FFFFFF" }}
                    className="text-sm font-semibold"
                  >
                    {getTypeText(speaker)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Biography */}
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
              onPress={() => setIsBioExpanded(!isBioExpanded)}
              className="flex-row items-center justify-between mb-3"
            >
              <Text
                style={{ color: "#000000", fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
                className="text-lg font-semibold"
              >
                Biografía
              </Text>
              {isBioExpanded ? (
                <ChevronUp size={20} color={Colors.text} />
              ) : (
                <ChevronDown size={20} color={Colors.text} />
              )}
            </TouchableOpacity>
            
            <Text 
              style={{ color: Colors.textSecondary, fontFamily: 'Helvetica Neue' }} 
              className="leading-6"
              numberOfLines={isBioExpanded ? undefined : 12}
            >
              {speaker.bio}
            </Text>
          </View>

          {/* Sessions */}
          {speaker.speakerSessions && speaker.speakerSessions.length > 0 && (
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
              <Text
                style={{ color: "#000000", fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
                className="text-lg font-semibold mb-4"
              >
                Sesiones
              </Text>
              {speaker.speakerSessions.map((speakerSession, index) => {
                // Verificar que session no sea null
                if (!speakerSession.session) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={speakerSession.session.id}
                    style={{ borderBottomColor: "rgba(255,255,255,0.3)" }}
                    className="py-4 border-b last:border-b-0"
                    onPress={() =>
                      router.push(`/session/${speakerSession.session!.id}`)
                    }
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-3">
                        <Text
                          style={{ color: Colors.text, fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
                          className="font-semibold mb-1"
                        >
                          {speakerSession.session.title}
                        </Text>
                        <View className="flex-row items-center">
                          <Calendar size={14} color="#2c3c94" />
                          <Text
                            style={{ color: "#2c3c94", fontWeight: "500", fontFamily: 'Helvetica Neue' }}
                            className="text-sm ml-1"
                          >
                            {formatDate(speakerSession.session.startsAt)} •{" "}
                            {formatPeruTime(speakerSession.session.startsAt)} -{" "}
                            {formatPeruTime(speakerSession.session.endsAt)}
                          </Text>
                        </View>
                      </View>
                      <ExternalLink size={16} color="#f43c44" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Actions */}
          <View className="px-6 py-6 mt-4">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/speakers")}
              style={{ backgroundColor: "#2c3c94" }}
              className="py-4 px-6 rounded-lg"
            >
              <View className="flex-row items-center justify-center">
                <User size={20} color="#FFFFFF" />
                <Text
                  style={{ color: "#FFFFFF", fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
                  className="font-semibold ml-2"
                >
                  Ver todos los speakers
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

