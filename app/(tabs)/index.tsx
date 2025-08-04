import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, MapPin, Users, LogOut, User, ChevronRight } from "lucide-react-native";
import { sectionsApi, speakersApi } from "@/services/api";
import { Section, Speaker } from "@/types";

import Logo from "../../assets/images/logoLogin.png";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Loading home data...");
      const [sectionsData, speakersData] = await Promise.all([
        sectionsApi.getSections(),
        speakersApi.getSpeakers(),
      ]);
      
      // Get first 5 sections for carousel
      const limitedSections = sectionsData.slice(0, 5);
      console.log("First section data:", limitedSections[0]);
      setSections(limitedSections);
      
      // Get first 10 speakers for carousel
      setSpeakers(speakersData.slice(0, 10));
    } catch (error) {
      console.error("Error loading home data:", error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
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

  const renderSectionCard = ({ item }: { item: Section }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mr-3 shadow-sm border border-gray-100 w-72"
      onPress={() => router.push(`/section/${item.id}`)}
    >
      <Text className="text-lg font-bold text-gray-800 mb-2" numberOfLines={2}>
        {item.title}
      </Text>

      {item.description && (
        <Text className="text-gray-600 mb-3 text-sm leading-5" numberOfLines={3}>
          {item.description}
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Clock size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Calendar size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {item.sessions.length} sesión{item.sessions.length > 1 ? 'es' : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSpeakerCard = ({ item }: { item: Speaker }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mr-3 shadow-sm border border-gray-100 w-40 items-center"
      onPress={() => router.push(`/speaker/${item.id}`)}
    >
      <View className="mb-3">
        {item.picture ? (
          <Image
            source={{ uri: item.picture }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <User size={24} color="#6b7280" />
          </View>
        )}
      </View>

      <Text className="text-center font-bold text-gray-800 mb-1" numberOfLines={2}>
        {item.name} {item.lastName}
      </Text>

      <Text className="text-center text-gray-600 text-xs" numberOfLines={2}>
        {item.position}
      </Text>

      <Text className="text-center text-gray-500 text-xs mt-1">
        {item.country}
      </Text>
    </TouchableOpacity>
  );

  const renderViewMoreCard = (type: 'sections' | 'speakers') => (
    <TouchableOpacity
      className={`bg-blue-50 rounded-xl p-4 mr-3 shadow-sm border border-blue-100 items-center justify-center ${
        type === 'sections' ? 'w-72' : 'w-40'
      }`}
      onPress={() => router.push(type === 'sections' ? '/(tabs)/sections' : '/(tabs)/speakers')}
    >
      <ChevronRight size={24} color="#2563eb" />
      <Text className="text-blue-600 font-semibold text-center mt-2">
        Ver todas
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="w-full">
          <Image source={Logo} className="w-full h-64" resizeMode="contain" />
        </View>

        {/* Próximas Sesiones */}
        <View className="pb-6">
          <View className="px-6 mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Próximas sesiones
                </Text>
                <View className="flex-row items-center mt-1">
                  <Calendar size={14} color="#747474" />
                  <Text className="text-gray-500 text-sm ml-1 font-medium">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push("/(tabs)/sections")}>
                <Text className="text-blue-600 font-semibold">Ver todas</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={[...sections, { id: 'view-more' }]}
            renderItem={({ item }) => {
              if (item.id === 'view-more') {
                return renderViewMoreCard('sections');
              }
              return renderSectionCard({ item });
            }}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>

        {/* Expositores */}
        <View className="pb-6">
          <View className="px-6 mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">
                Expositores
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/speakers")}>
                <Text className="text-blue-600 font-semibold">Ver todos</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={[...speakers, { id: 'view-more' }]}
            renderItem={({ item }) => {
              if (item.id === 'view-more') {
                return renderViewMoreCard('speakers');
              }
              return renderSpeakerCard({ item });
            }}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
