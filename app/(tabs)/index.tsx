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
} from "react-native";
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
import { formatPeruTime } from "@/utils/formatPeruTime";

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

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


  const renderSectionCard = ({ item }: { item: Section }) => (
    <TouchableOpacity
      className="rounded-xl mr-3 w-72"
      onPress={() => router.push(`/section/${item.id}`)}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          backgroundColor: "white",
        }}
      >
        <Text
          style={{ color: Colors.text, minHeight: 44 }}
          className="text-lg font-bold mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text
          style={{ color: Colors.textSecondary, minHeight: 60 }}
          className="mb-3 text-sm leading-5"
          numberOfLines={3}
        >
          {item.description || ""}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={14} color="#2c3c94" />
            <Text
              style={{ color: "#2c3c94", fontWeight: "600", fontSize: 12 }}
              className="ml-1"
            >
              {formatPeruTime(item.startsAt)} - {formatPeruTime(item.endsAt)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={14} color="#2c3c94" />
            <Text
              style={{ color: "#2c3c94", fontWeight: "600", fontSize: 12 }}
              className="ml-1"
            >
              {item.sessions.length} sesión
              {item.sessions.length > 1 ? "es" : ""}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSpeakerCard = ({ item }: { item: Speaker }) => (
    <TouchableOpacity
      className="rounded-xl mr-3 w-40"
      onPress={() => router.push(`/speaker/${item.id}`)}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          alignItems: "center",
          backgroundColor: "white",
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
              style={{ backgroundColor: Colors.backgroundTertiary }}
              className="w-16 h-16 rounded-full items-center justify-center"
            >
              <User size={24} color={Colors.textTertiary} />
            </View>
          )}
        </View>

        <Text
          style={{ color: Colors.text }}
          className="text-center font-bold mb-1"
          numberOfLines={2}
        >
          {item.name} {item.lastName}
        </Text>

        <Text
          style={{ color: Colors.textSecondary }}
          className="text-center text-xs"
          numberOfLines={2}
        >
          {item.position}
        </Text>
      </View>
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
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eff3f6",
        }}
      >
        <ChevronRight size={24} color={Colors.text} />
        <Text
          style={{ color: Colors.text }}
          className="font-semibold text-center mt-2"
        >
          Ver todos
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#2c3c94" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2c3c94" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />
        <ScrollView
          style={{ flex: 1, backgroundColor: "#eff3f6" }}
          contentContainerStyle={{ backgroundColor: "transparent" }}
          bounces={false}
          overScrollMode="never"
        >
          <View style={{ height: 256, position: "relative" }}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 128,
                backgroundColor: "#2c3c94",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 128,
                backgroundColor: "#eff3f6",
              }}
            />
            <Image
              source={Logo}
              className="w-full h-64"
              resizeMode="contain"
              style={{ position: "relative", zIndex: 1 }}
            />
          </View>
          {/* Próximas Sesiones */}
          <View className="pb-6" style={{ marginTop: -40 }}>
            <View className="px-6 mb-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    style={{ color: Colors.text }}
                    className="text-xl font-bold"
                  >
                    Próximas sesiones
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Calendar size={14} color={Colors.textTertiary} />
                    <Text
                      style={{ color: Colors.textTertiary }}
                      className="text-sm ml-1 font-medium"
                    >
                      {new Date().toLocaleDateString("es-PE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "America/Lima",
                      })}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/sections")}
                >
                  <Text
                    style={{
                      color: "red",
                    }}
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
                return renderSectionCard({ item: item as Section });
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
                  style={{ color: Colors.text }}
                  className="text-xl font-bold"
                >
                  Expositores
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/speakers")}
                >
                  <Text
                    style={{
                      color: "#f43c44",
                    }}
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
                return renderSpeakerCard({ item: item as Speaker });
              }}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
