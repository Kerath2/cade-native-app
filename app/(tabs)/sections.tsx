import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Alert,
  useColorScheme,
} from 'react-native';
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
      style={{ 
        backgroundColor: colors.cardBackground, 
        borderColor: colors.cardBorder,
        shadowColor: colors.cardShadow 
      }}
      className="rounded-xl p-4 mb-4 shadow-sm border"
      onPress={() => router.push(`/section/${section.id}`)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-1">
            {section.title}
          </Text>
          {section.description && (
            <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
              {section.description}
            </Text>
          )}
        </View>
        <ChevronRight size={20} color={colors.textTertiary} />
      </View>
      
      <View style={{ borderTopColor: colors.border }} className="flex-row items-center justify-between pt-3 border-t">
        <View className="flex-row items-center">
          <Clock size={14} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary }} className="text-sm ml-1">
            {formatTime(section.startsAt)} - {formatTime(section.endsAt)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Calendar size={14} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary }} className="text-sm ml-1">
            {section.sessions.length} sesión{section.sessions.length > 1 ? 'es' : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <View style={{ backgroundColor: colors.background, borderBottomColor: colors.border }} className="px-6 py-4 border-b">
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
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  );
}