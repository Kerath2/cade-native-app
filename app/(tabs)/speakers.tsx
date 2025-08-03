import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Search, User, Building, ChevronRight } from 'lucide-react-native';

interface Speaker {
  id: number;
  name: string;
  position?: string;
  company?: string;
  bio?: string;
  image?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  role: 'SPEAKER' | 'MODERATOR' | 'PANELIST';
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      // TODO: Implement API call to load speakers
      console.log('Loading speakers...');
      // Mock data for now
      setSpeakers([
        {
          id: 1,
          name: 'María González',
          position: 'CEO',
          company: 'TechCorp Perú',
          bio: 'Experta en transformación digital con más de 15 años de experiencia',
          gender: 'FEMALE',
          role: 'SPEAKER',
        },
        {
          id: 2,  
          name: 'Carlos Rodríguez',
          position: 'Director de Innovación',
          company: 'StartupHub',
          bio: 'Líder en desarrollo de ecosistemas de innovación',
          gender: 'MALE',
          role: 'MODERATOR',
        },
        {
          id: 3,
          name: 'Ana Vargas',
          position: 'Gerente General',
          company: 'Sostenible SAC',
          bio: 'Especialista en sostenibilidad empresarial y ESG',
          gender: 'FEMALE', 
          role: 'PANELIST',
        },
      ]);
    } catch (error) {
      console.error('Error loading speakers:', error);
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
        speaker.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpeakers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSpeakers();
    setRefreshing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SPEAKER':
        return 'bg-blue-100 text-blue-800';
      case 'MODERATOR':
        return 'bg-green-100 text-green-800';
      case 'PANELIST':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'SPEAKER':
        return 'Speaker';
      case 'MODERATOR':
        return 'Moderador';
      case 'PANELIST':
        return 'Panelista';
      default:
        return role;
    }
  };

  const renderSpeakerCard = (speaker: Speaker) => (
    <TouchableOpacity
      key={speaker.id}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => router.push(`/speaker/${speaker.id}`)}
    >
      <View className="flex-row items-start">
        <View className="mr-4">
          {speaker.image ? (
            <Image
              source={{ uri: speaker.image }}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
              <User size={24} color="#6b7280" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-gray-800 mb-1">
                {speaker.name}
              </Text>
              
              {speaker.position && (
                <Text className="text-gray-600 text-sm mb-1">
                  {speaker.position}
                </Text>
              )}
              
              {speaker.company && (
                <View className="flex-row items-center mb-2">
                  <Building size={12} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {speaker.company}
                  </Text>
                </View>
              )}
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </View>

          <View className="flex-row items-center justify-between">
            <View className={`px-2 py-1 rounded-full ${getRoleColor(speaker.role)}`}>
              <Text className={`text-xs font-semibold ${getRoleColor(speaker.role).split(' ')[1]}`}>
                {getRoleText(speaker.role)}
              </Text>
            </View>
          </View>

          {speaker.bio && (
            <Text className="text-gray-600 text-sm mt-2 leading-5" numberOfLines={2}>
              {speaker.bio}
            </Text>
          )}
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
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Speakers del Evento
          </Text>
          
          {filteredSpeakers.length > 0 ? (
            filteredSpeakers.map(renderSpeakerCard)
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <User size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4">
                {searchQuery ? 'No se encontraron speakers' : 'No hay speakers disponibles'}
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