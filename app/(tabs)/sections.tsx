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
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Search, Calendar, Clock, ChevronRight } from "lucide-react-native";
import { sectionsApi } from "@/services/api";
import Colors from "@/constants/Colors";

import { Section } from "@/types";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    filterSections();
  }, [searchQuery, sections]);

  const loadSections = async () => {
    setLoading(true);
    try {
      console.log("Loading sections from API...");
      const sectionsData = await sectionsApi.getSections();
      setSections(sectionsData);
    } catch (error) {
      console.error("Error loading sections:", error);
      Alert.alert("Error", "No se pudieron cargar las secciones");
    } finally {
      setLoading(false);
    }
  };

  const filterSections = () => {
    if (!searchQuery.trim()) {
      setFilteredSections(sections);
      return;
    }

    const filtered = sections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredSections(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSections();
    setRefreshing(false);
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
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const renderSectionCard = (section: Section) => (
    <TouchableOpacity
      key={section.id}
      className="rounded-xl mb-4 "
      onPress={() => router.push(`/section/${section.id}`)}
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
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text
              style={{ color: Colors.text }}
              className="text-lg font-bold mb-1"
            >
              {section.title}
            </Text>
            {section.description && (
              <Text
                style={{ color: Colors.textSecondary }}
                className="text-sm leading-5"
              >
                {section.description}
              </Text>
            )}
          </View>
          <ChevronRight size={20} color="#f43c44" />
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
              {formatTime(section.startsAt)} - {formatTime(section.endsAt)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={14} color="#2c3c94" />
            <Text
              style={{ color: "#2c3c94", fontWeight: "500" }}
              className="text-sm ml-1"
            >
              {section.sessions.length} sesión
              {section.sessions.length > 1 ? "es" : ""}
            </Text>
          </View>
        </View>
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
                placeholder="Buscar secciones..."
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
              {filteredSections.length > 0 ? (
                filteredSections.map(renderSectionCard)
              ) : (
                <View
                  style={{ backgroundColor: Colors.cardBackground }}
                  className="rounded-xl p-8 items-center"
                >
                  <Calendar size={48} color={Colors.textTertiary} />
                  <Text
                    style={{ color: Colors.textTertiary }}
                    className="text-center mt-4"
                  >
                    {searchQuery
                      ? "No se encontraron secciones"
                      : "No hay secciones disponibles"}
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

