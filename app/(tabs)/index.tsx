import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Image,
  FlatList,
  Alert,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react-native";
import { sectionsApi, speakersApi } from "@/services/api";
import { Section, Speaker } from "@/types";
import Colors from "@/constants/Colors";

import Logo from "../../assets/images/logoLogin.png";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const getCardGradient = () => {
    if (colorScheme === "dark") {
      return [colors.primary, colors.brandSecondary];
    } else {
      return [colors.primary, colors.primaryAccent];
    }
  };

  const getBackgroundGradient = () => {
    if (colorScheme === "dark") {
      return ["rgb(45,60,150)", "rgb(35,45,120)", "rgb(25,35,90)"];
    } else {
      return ["#f53b43", "rgb(255,217,224)", "rgb(255,255,255)"];
    }
  };

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
      className="rounded-xl mr-3 shadow-sm w-72"
      onPress={() => router.push(`/section/${item.id}`)}
    >
      <LinearGradient
        colors={getCardGradient()}
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
        <Text
          style={{ color: "#FFFFFF" }}
          className="text-lg font-bold mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.description && (
          <Text
            style={{ color: "#F0F0F0" }}
            className="mb-3 text-sm leading-5"
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={14} color="#E0E0E0" />
            <Text style={{ color: "#E0E0E0" }} className="text-sm ml-1">
              {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={14} color="#E0E0E0" />
            <Text style={{ color: "#E0E0E0" }} className="text-sm ml-1">
              {item.sessions.length} sesión
              {item.sessions.length > 1 ? "es" : ""}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSpeakerCard = ({ item }: { item: Speaker }) => (
    <TouchableOpacity
      className="rounded-xl mr-3 shadow-sm w-40"
      onPress={() => router.push(`/speaker/${item.id}`)}
    >
      <LinearGradient
        colors={getCardGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          alignItems: "center",
        }}
      >
        <View className="mb-3">
          {item.picture ? (
            <Image
              source={{ uri: item.picture }}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <View
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              className="w-16 h-16 rounded-full items-center justify-center"
            >
              <User size={24} color="#E0E0E0" />
            </View>
          )}
        </View>

        <Text
          style={{ color: "#FFFFFF" }}
          className="text-center font-bold mb-1"
          numberOfLines={2}
        >
          {item.name} {item.lastName}
        </Text>

        <Text
          style={{ color: "#F0F0F0" }}
          className="text-center text-xs"
          numberOfLines={2}
        >
          {item.position}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderViewMoreCard = (type: "sections" | "speakers") => (
    <TouchableOpacity
      className={`rounded-xl mr-3 shadow-sm ${
        type === "sections" ? "w-72" : "w-40"
      }`}
      onPress={() =>
        router.push(
          type === "sections" ? "/(tabs)/sections" : "/(tabs)/speakers",
        )
      }
    >
      <LinearGradient
        colors={getCardGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronRight size={24} color="#FFFFFF" />
        <Text
          style={{ color: "#FFFFFF" }}
          className="font-semibold text-center mt-2"
        >
          Ver todos
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ backgroundColor: "transparent" }}
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
          <View className="w-full">
            <Image source={Logo} className="w-full h-64" resizeMode="contain" />
          </View>

          {/* Próximas Sesiones */}
          <View className="pb-6">
            <View className="px-6 mb-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    style={{ color: colors.text }}
                    className="text-xl font-bold"
                  >
                    Próximas sesiones
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Calendar size={14} color={colors.textTertiary} />
                    <Text
                      style={{ color: colors.textTertiary }}
                      className="text-sm ml-1 font-medium"
                    >
                      {new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/sections")}
                >
                  <Text
                    style={{ color: colors.primary }}
                    className="font-semibold"
                  >
                    Ver todas
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={[...sections, { id: "view-more" }]}
              renderItem={({ item }) => {
                if (item.id === "view-more") {
                  return renderViewMoreCard("sections");
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
                <Text
                  style={{ color: colors.text }}
                  className="text-xl font-bold"
                >
                  Expositores
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/speakers")}
                >
                  <Text
                    style={{ color: colors.primary }}
                    className="font-semibold"
                  >
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={[...speakers, { id: "view-more" }]}
              renderItem={({ item }) => {
                if (item.id === "view-more") {
                  return renderViewMoreCard("speakers");
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
    </LinearGradient>
  );
}
