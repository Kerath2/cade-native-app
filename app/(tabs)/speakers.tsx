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
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

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
        bg: colors.error + "20", // 20% opacity
        text: "#FFFFFF",
      };
    if (speaker.isCommittee)
      return {
        bg: colors.success + "20",
        text: "#FFFFFF",
      };
    return {
      bg: colors.primary + "20",
      text: "#FFFFFF",
    };
  };

  const getTypeText = (speaker: Speaker) => {
    if (speaker.isHost) return "Anfitrión";
    if (speaker.isCommittee) return "Comité";
    return "Speaker";
  };

  const getCardGradient = () => {
    if (colorScheme === "dark") {
      return [colors.primary, colors.brandSecondary];
    } else {
      return [colors.primary, colors.primaryAccent];
    }
  };

  const getBackgroundGradient = () => {
    if (colorScheme === "dark") {
      return ['rgb(45,60,150)', 'rgb(35,45,120)', 'rgb(25,35,90)'];
    } else {
      return ['#f53b43', 'rgb(255,217,224)', 'rgb(255,255,255)'];
    }
  };

  const renderSpeakerCard = (speaker: Speaker) => {
    const typeColors = getTypeColor(speaker);
    const gradientColors = getCardGradient();
    return (
      <TouchableOpacity
        key={speaker.id}
        className="rounded-xl mb-4 shadow-sm"
        onPress={() => router.push(`/speaker/${speaker.id}`)}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.cardBorder,
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
                style={{ backgroundColor: colors.backgroundTertiary }}
                className="w-16 h-16 rounded-full items-center justify-center"
              >
                <User size={24} color={colors.textTertiary} />
              </View>
            )}
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-3">
                <Text
                  style={{ color: "#FFFFFF" }}
                  className="text-lg font-bold mb-1"
                >
                  {speaker.name} {speaker.lastName}
                </Text>
                <Text
                  style={{ color: "#F0F0F0" }}
                  className="text-sm mb-1"
                >
                  {speaker.position}
                </Text>
                <View className="flex-row items-center mb-2">
                  <Building size={12} color="#E0E0E0" />
                  <Text
                    style={{ color: "#E0E0E0" }}
                    className="text-xs ml-1"
                  >
                    {speaker.country}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#E0E0E0" />
            </View>

            <View className="flex-row items-center justify-between">
              <Text
                style={{ color: "#F0F0F0" }}
                className="text-sm leading-5 flex-1 mr-2"
                numberOfLines={2}
              >
                {speaker.bio}
              </Text>
              <View
                style={{ backgroundColor: typeColors.bg }}
                className="px-2 py-1 rounded-full"
              >
                <Text
                  style={{ color: typeColors.text }}
                  className="text-xs font-semibold"
                >
                  {getTypeText(speaker)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={getBackgroundGradient()}
      locations={colorScheme === "dark" ? [0, 0.5, 1] : [0, 0.2, 1]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent={true}
        />
      <View
        style={{
          backgroundColor: "transparent",
          borderBottomColor: "rgba(255,255,255,0.1)",
        }}
        className="px-6 py-4 border-b"
      >
        <View
          style={{ backgroundColor: colors.backgroundTertiary }}
          className="flex-row items-center rounded-lg px-3 py-2"
        >
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={{ color: colors.text }}
            className="flex-1 ml-3"
            placeholder="Buscar speakers..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ backgroundColor: 'transparent' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            backgroundColor="transparent"
          />
        }
      >
        <View className="px-6 py-6">
          {filteredSpeakers.length > 0 ? (
            filteredSpeakers.map(renderSpeakerCard)
          ) : (
            <View
              style={{ backgroundColor: colors.cardBackground }}
              className="rounded-xl p-8 items-center"
            >
              <User size={48} color={colors.textTertiary} />
              <Text
                style={{ color: colors.textTertiary }}
                className="text-center mt-4"
              >
                {searchQuery
                  ? "No se encontraron speakers"
                  : "No hay speakers disponibles"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{ backgroundColor: colors.buttonPrimary }}
                  className="mt-3 px-4 py-2 rounded-lg"
                >
                  <Text
                    style={{ color: colors.buttonPrimaryText }}
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
      </SafeAreaView>
    </LinearGradient>
  );
}
