import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Search, User, Building, ChevronRight } from "lucide-react-native";
import { speakersApi } from "@/services/api";
import Colors from "@/constants/Colors";

import { Speaker } from "@/types";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSpeakers();
  }, []);

  useEffect(() => {
    filterSpeakers();
  }, [searchQuery, speakers]);

  const loadSpeakers = async () => {
    setLoading(true);
    try {
      console.log("Loading speakers from API...");
      const speakersData = await speakersApi.getSpeakers();
      setSpeakers(speakersData);
    } catch (error) {
      console.error("Error loading speakers:", error);
      Alert.alert("Error", "No se pudieron cargar los speakers");
    } finally {
      setLoading(false);
    }
  };

  const filterSpeakers = () => {
    if (!searchQuery.trim()) {
      setFilteredSpeakers(speakers);
      return;
    }

    const filtered = speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.country.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredSpeakers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSpeakers();
    setRefreshing(false);
  };

  const getTypeColor = (speaker: Speaker) => {
    if (speaker.isHost)
      return {
        bg: Colors.error + "20", // 20% opacity
        text: Colors.text,
      };
    if (speaker.isCommittee)
      return {
        bg: Colors.success + "20",
        text: Colors.text,
      };
    return {
      bg: Colors.primary + "20",
      text: "#FFFFFF",
    };
  };

  const getTypeText = (speaker: Speaker) => {
    if (speaker.isHost) return "Anfitrión";
    if (speaker.isCommittee) return "Comité";
    return "Speaker";
  };

  const renderSpeakerCard = (speaker: Speaker) => {
    const typeColors = getTypeColor(speaker);
    return (
      <TouchableOpacity
        key={speaker.id}
        className="rounded-xl mb-4 "
        onPress={() => router.push(`/speaker/${speaker.id}`)}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}
        >
          <View className="flex-row items-start">
            <View className="mr-4">
              {speaker.picture ? (
                <Image
                  source={{ uri: speaker.picture }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View
                  style={{ backgroundColor: Colors.backgroundTertiary }}
                  className="w-16 h-16 rounded-full items-center justify-center"
                >
                  <User size={24} color={Colors.textTertiary} />
                </View>
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Text
                    style={{ color: Colors.text }}
                    className="text-lg font-bold mb-1"
                  >
                    {speaker.name} {speaker.lastName}
                  </Text>
                  <Text
                    style={{ color: Colors.textSecondary }}
                    className="text-sm mb-1"
                  >
                    {speaker.position}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Building size={14} color="#2c3c94" />
                    <Text
                      style={{
                        color: "#2c3c94",
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                      className="ml-1"
                    >
                      {speaker.country}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#f43c44" />
              </View>

              <View className="flex-row items-center justify-between">
                <Text
                  style={{ color: Colors.textSecondary }}
                  className="text-sm leading-5 flex-1 mr-2"
                  numberOfLines={2}
                >
                  {speaker.bio}
                </Text>
                <View
                  style={{ backgroundColor: speaker.isCommittee ? "rgb(0, 173, 238)" : "#2c3c94" }}
                  className="px-2 py-1 rounded-full"
                >
                  <Text
                    style={{ color: "#FFFFFF" }}
                    className="text-xs font-semibold"
                  >
                    {getTypeText(speaker)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#2c3c94" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2c3c94" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />
        <View style={{ backgroundColor: "#2c3c94", height: 30 }} />
        <View style={{ flex: 1, backgroundColor: "#eff3f6" }}>
          <View
            style={{
              backgroundColor: "transparent",
              borderBottomColor: "rgba(255,255,255,0.1)",
            }}
            className="px-6 py-4 border-b"
          >
            <View
              style={{ backgroundColor: "#FFFFFF" }}
              className="flex-row items-center rounded-lg px-3 py-2"
            >
              <Search size={20} color={Colors.textTertiary} />
              <TextInput
                style={{ color: "#000000" }}
                className="flex-1 ml-3"
                placeholder="Buscar speakers..."
                placeholderTextColor="#666666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ backgroundColor: "transparent" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
                backgroundColor="transparent"
              />
            }
          >
            <View className="px-6 py-6">
              {filteredSpeakers.length > 0 ? (
                filteredSpeakers.map(renderSpeakerCard)
              ) : (
                <View
                  style={{ backgroundColor: Colors.cardBackground }}
                  className="rounded-xl p-8 items-center"
                >
                  <User size={48} color={Colors.textTertiary} />
                  <Text
                    style={{ color: Colors.textTertiary }}
                    className="text-center mt-4"
                  >
                    {searchQuery
                      ? "No se encontraron speakers"
                      : "No hay speakers disponibles"}
                  </Text>
                  {searchQuery && (
                    <TouchableOpacity
                      onPress={() => setSearchQuery("")}
                      style={{ backgroundColor: Colors.buttonPrimary }}
                      className="mt-3 px-4 py-2 rounded-lg"
                    >
                      <Text
                        style={{ color: Colors.buttonPrimaryText }}
                        className="font-semibold"
                      >
                        Limpiar búsqueda
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
