import React, { useEffect, useState } from 'react';
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
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { sectionsApi } from '@/services/api';
import Colors from '@/constants/Colors';

import { Section } from '@/types';

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

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

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    filterSections();
  }, [searchQuery, sections]);

  const loadSections = async () => {
    setLoading(true);
    try {
      console.log('Loading sections from API...');
      const sectionsData = await sectionsApi.getSections();
      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading sections:', error);
      Alert.alert('Error', 'No se pudieron cargar las secciones');
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
        section.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderSectionCard = (section: Section) => (
    <TouchableOpacity
      key={section.id}
      className="rounded-xl mb-4 shadow-sm"
      onPress={() => router.push(`/section/${section.id}`)}
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
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text style={{ color: "#FFFFFF" }} className="text-lg font-bold mb-1">
            {section.title}
          </Text>
          {section.description && (
            <Text style={{ color: "#F0F0F0" }} className="text-sm leading-5">
              {section.description}
            </Text>
          )}
        </View>
        <ChevronRight size={20} color="#E0E0E0" />
      </View>
      
      <View style={{ borderTopColor: "rgba(255,255,255,0.2)" }} className="flex-row items-center justify-between pt-3 border-t">
        <View className="flex-row items-center">
          <Clock size={14} color="#E0E0E0" />
          <Text style={{ color: "#E0E0E0" }} className="text-sm ml-1">
            {formatTime(section.startsAt)} - {formatTime(section.endsAt)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Calendar size={14} color="#E0E0E0" />
          <Text style={{ color: "#E0E0E0" }} className="text-sm ml-1">
            {section.sessions.length} sesión{section.sessions.length > 1 ? 'es' : ''}
          </Text>
        </View>
      </View>
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
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ backgroundColor: "transparent", borderBottomColor: "rgba(255,255,255,0.1)" }} className="px-6 py-4 border-b">
        <View style={{ backgroundColor: colors.backgroundTertiary }} className="flex-row items-center rounded-lg px-3 py-2">
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={{ color: colors.text }}
            className="flex-1 ml-3"
            placeholder="Buscar secciones..."
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
          {filteredSections.length > 0 ? (
            filteredSections.map(renderSectionCard)
          ) : (
            <View style={{ backgroundColor: colors.cardBackground }} className="rounded-xl p-8 items-center">
              <Calendar size={48} color={colors.textTertiary} />
              <Text style={{ color: colors.textTertiary }} className="text-center mt-4">
                {searchQuery ? 'No se encontraron secciones' : 'No hay secciones disponibles'}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
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
    </LinearGradient>
  );
}