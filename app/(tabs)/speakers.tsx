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
} from "react-native";
import { router } from "expo-router";
import { Search, User, Building, ChevronRight } from "lucide-react-native";
import { speakersApi } from "@/services/api";

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
    if (speaker.isHost) return "bg-red-100 text-red-800";
    if (speaker.isCommittee) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const getTypeText = (speaker: Speaker) => {
    if (speaker.isHost) return "Anfitrión";
    if (speaker.isCommittee) return "Comité";
    return "Speaker";
  };

  const renderSpeakerCard = (speaker: Speaker) => (
    <TouchableOpacity
      key={speaker.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
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
            <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
              <User size={24} color="#6b7280" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between ">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-gray-800 mb-1">
                {speaker.name} {speaker.lastName}
              </Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </View>

          <Text className="text-gray-600 text-sm leading-5" numberOfLines={2}>
            {speaker.bio}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Buscar speakers..."
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
            <View className="bg-white rounded-xl p-8 items-center">
              <User size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4">
                {searchQuery
                  ? "No se encontraron speakers"
                  : "No hay speakers disponibles"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="mt-3 px-4 py-2 bg-blue-600 rounded-lg"
                >
                  <Text className="text-white font-semibold">
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

