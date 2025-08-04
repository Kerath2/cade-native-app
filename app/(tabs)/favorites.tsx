import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, LogOut, Star } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function MorePage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: User,
      title: 'Perfil',
      subtitle: 'Ver y editar información personal',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: Star,
      title: 'Favoritos',
      subtitle: 'Sesiones marcadas como favoritas',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: LogOut,
      title: 'Cerrar sesión',
      subtitle: 'Salir de la aplicación',
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Más opciones
        </Text>
        
        <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 flex-row items-center ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={item.onPress}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                item.isDestructive ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <item.icon 
                  size={20} 
                  color={item.isDestructive ? '#dc2626' : '#6b7280'} 
                />
              </View>
              
              <View className="flex-1">
                <Text className={`font-semibold mb-1 ${
                  item.isDestructive ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}