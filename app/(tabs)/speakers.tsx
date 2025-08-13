import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Image,
  Alert,
  useColorScheme,
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

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
    if (speaker.isHost) return {
      bg: colors.error + '20', // 20% opacity
      text: colorScheme === 'dark' ? colors.error : colors.error
    };
    if (speaker.isCommittee) return {
      bg: colors.success + '20',
      text: colorScheme === 'dark' ? colors.success : colors.success
    };
    return {
      bg: colors.primary + '20',
      text: colorScheme === 'dark' ? colors.primary : colors.primary
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
        style={{ 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.cardBorder,
          shadowColor: colors.cardShadow 
        }}
        className="rounded-xl p-4 mb-4 shadow-sm border"
        onPress={() => router.push(`/speaker/${speaker.id}`)}
      >
        <View className="flex-row items-start">
          <View className="mr-4">
            {speaker.picture ? (
              <Image
                source={{ uri: speaker.picture }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <View style={{ backgroundColor: colors.backgroundTertiary }} className="w-16 h-16 rounded-full items-center justify-center">
                <User size={24} color={colors.textTertiary} />
              </View>
            )}
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-3">
                <Text style={{ color: colors.text }} className="text-lg font-bold mb-1">
                  {speaker.name} {speaker.lastName}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm mb-1">
                  {speaker.position}
                </Text>
                <View className="flex-row items-center mb-2">
                  <Building size={12} color={colors.textTertiary} />
                  <Text style={{ color: colors.textTertiary }} className="text-xs ml-1">
                    {speaker.country}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: colors.textSecondary }} className="text-sm leading-5 flex-1 mr-2" numberOfLines={2}>
                {speaker.bio}
              </Text>
              <View 
                style={{ backgroundColor: typeColors.bg }}
                className="px-2 py-1 rounded-full"
              >
                <Text style={{ color: typeColors.text }} className="text-xs font-semibold">
                  {getTypeText(speaker)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <View style={{ backgroundColor: colors.background, borderBottomColor: colors.border }} className="px-6 py-4 border-b">
        <View style={{ backgroundColor: colors.backgroundTertiary }} className="flex-row items-center rounded-lg px-3 py-2">
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
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-6">
          {filteredSpeakers.length > 0 ? (
            filteredSpeakers.map(renderSpeakerCard)
          ) : (
            <View style={{ backgroundColor: colors.cardBackground }} className="rounded-xl p-8 items-center">
              <User size={48} color={colors.textTertiary} />
              <Text style={{ color: colors.textTertiary }} className="text-center mt-4">
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
                  <Text style={{ color: colors.buttonPrimaryText }} className="font-semibold">
                    Limpiar búsqueda
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

