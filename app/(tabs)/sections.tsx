import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react-native';

interface Section {
  id: number;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  sessions: any[];
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      // TODO: Implement API call to load sections
      console.log('Loading sections...');
      // Mock data for now
      setSections([
        {
          id: 1,
          name: 'Sesión de Apertura',
          description: 'Inauguración oficial del evento CADE Ejecutivos 2025',
          startsAt: '2025-11-15T09:00:00Z',
          endsAt: '2025-11-15T10:00:00Z',
          sessions: [1],
        },
        {
          id: 2,
          name: 'Transformación Digital',
          description: 'El impacto de la tecnología en los negocios modernos',
          startsAt: '2025-11-15T10:30:00Z',
          endsAt: '2025-11-15T12:00:00Z',
          sessions: [2, 3],
        },
        {
          id: 3,
          name: 'Sostenibilidad Empresarial',
          description: 'Estrategias para un futuro sostenible en los negocios',
          startsAt: '2025-11-15T14:00:00Z',
          endsAt: '2025-11-15T15:30:00Z',
          sessions: [4],
        },
      ]);
    } catch (error) {
      console.error('Error loading sections:', error);
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
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSections(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSections();
    setRefreshing(false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => router.push(`/section/${section.id}`)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {section.name}
          </Text>
          <Text className="text-gray-600 text-sm leading-5">
            {section.description}
          </Text>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </View>
      
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Clock size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {formatTime(section.startsAt)} - {formatTime(section.endsAt)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Calendar size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {section.sessions.length} sesión{section.sessions.length > 1 ? 'es' : ''}
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
            placeholder="Buscar secciones..."
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
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Secciones del Evento
          </Text>
          
          {filteredSections.length > 0 ? (
            filteredSections.map(renderSectionCard)
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Calendar size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4">
                {searchQuery ? 'No se encontraron secciones' : 'No hay secciones disponibles'}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
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