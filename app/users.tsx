import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, Search, User as UserIcon, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { userChatApi } from '@/services/api/userChat';
import { User } from '@/types';
import Colors from '@/constants/Colors';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search text
    if (searchText.trim()) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users for chat...');
      console.log('Current user:', currentUser?.id, currentUser?.name);

      const data = await userChatApi.getUsers();
      console.log('Received users data:', data.length, 'users');
      console.log('Users:', data);

      // Filter out current user
      const filteredData = data.filter(user => user.id !== currentUser?.id);
      console.log('Filtered users:', filteredData.length, 'users after removing current user');

      setUsers(filteredData);
    } catch (error) {
      console.error('Error loading users:', error);
      console.error('Error details:', error.message);

      // Show user-friendly error
      if (error.message.includes('No se pudieron cargar los usuarios')) {
        Alert.alert('Error', 'No se pudieron cargar los usuarios disponibles. Verifica tu conexión e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const startConversation = (userId: number) => {
    navigation.navigate('chat-detail' as any, { userId: userId });
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => startConversation(item.id)}
      style={{
        backgroundColor: Colors.background,
        borderBottomColor: Colors.border,
      }}
      className="px-4 py-4 border-b"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <View
          style={{ backgroundColor: Colors.primary }}
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
        >
          <UserIcon size={24} color="#FFFFFF" />
        </View>

        {/* User Info */}
        <View className="flex-1">
          <Text
            style={{ color: Colors.text }}
            className="font-semibold text-base mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={{ color: Colors.textSecondary }}
            className="text-sm"
            numberOfLines={1}
          >
            {item.email}
          </Text>
        </View>

        {/* Message Icon */}
        <View className="ml-2">
          <MessageCircle size={20} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#2c3c94' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#2c3c94' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />

        {/* Header */}
        <View style={{ backgroundColor: '#2c3c94' }} className="px-4 py-3">
          <View className="flex-row items-center mb-3">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Nuevo Chat</Text>
          </View>

          {/* Search */}
          <View className="flex-row items-center">
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              className="flex-1 flex-row items-center border rounded-full px-4 py-2"
            >
              <Search size={16} color="rgba(255,255,255,0.7)" className="mr-2" />
              <TextInput
                style={{ color: '#FFFFFF' }}
                className="flex-1 text-white"
                placeholder="Buscar usuarios..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
        </View>

        {/* Users List */}
        <View style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}>
          {loading ? (
            <View className="flex-1 items-center justify-center px-8">
              <Text style={{ color: Colors.text }} className="text-lg">
                Cargando usuarios...
              </Text>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <UserIcon size={64} color={Colors.textSecondary} />
              <Text
                style={{ color: Colors.text }}
                className="text-lg font-semibold mt-4 text-center"
              >
                {searchText ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
              </Text>
              <Text
                style={{ color: Colors.textSecondary }}
                className="text-center mt-2"
              >
                {searchText
                  ? 'Intenta con otro término de búsqueda'
                  : 'Los usuarios aparecerán aquí cuando estén disponibles'
                }
              </Text>
              <TouchableOpacity
                onPress={loadUsers}
                style={{ backgroundColor: Colors.primary }}
                className="mt-4 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">
                  Intentar de nuevo
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}