import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, LogOut, Star, Settings, Info, Shield, HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

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
      title: 'Mi Perfil',
      subtitle: 'Ver y editar información personal',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: Star,
      title: 'Mis Favoritos',
      subtitle: 'Sesiones y speakers marcados como favoritos',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: Settings,
      title: 'Configuración',
      subtitle: 'Preferencias y ajustes de la aplicación',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: HelpCircle,
      title: 'Ayuda y Soporte',
      subtitle: 'Preguntas frecuentes y contacto',
      onPress: () => {
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
      },
    },
    {
      icon: Info,
      title: 'Acerca de CADE',
      subtitle: 'Información sobre el evento',
      onPress: () => {
        Alert.alert('CADE 2025', 'Conferencia Anual de Ejecutivos\nLima, Perú');
      },
    },
    {
      icon: Shield,
      title: 'Privacidad',
      subtitle: 'Términos y política de privacidad',
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
    <View
      style={{ flex: 1, backgroundColor: "#2c3c94" }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2c3c94" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2c3c94"
          translucent={false}
        />
        <View style={{ backgroundColor: "#2c3c94", height: 30 }} />
        <View style={{ flex: 1, backgroundColor: "#eff3f6" }}>
      <View className="px-6 py-6">
        <Text style={{ color: Colors.text }} className="text-2xl font-bold mb-2">
          Más opciones
        </Text>
        <Text style={{ color: Colors.textSecondary }} className="text-sm mb-6">
          Configura tu perfil y preferencias de la aplicación
        </Text>
        
        <View
          style={{
            backgroundColor: Colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            overflow: 'hidden',
          }}
          className="shadow-sm"
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{ 
                borderBottomColor: index !== menuItems.length - 1 ? Colors.border : 'transparent'
              }}
              className={`p-4 flex-row items-center ${
                index !== menuItems.length - 1 ? 'border-b' : ''
              }`}
              onPress={item.onPress}
            >
              <View 
                style={{ 
                  backgroundColor: item.isDestructive
                    ? Colors.error + '20'
                    : Colors.primaryLight 
                }}
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
              >
                <item.icon 
                  size={22} 
                  color={item.isDestructive ? Colors.error : Colors.primary} 
                />
              </View>
              
              <View className="flex-1">
                <Text 
                  style={{ 
                    color: item.isDestructive ? Colors.error : Colors.text
                  }}
                  className="font-semibold mb-1"
                >
                  {item.title}
                </Text>
                <Text style={{ color: Colors.textSecondary }} className="text-sm leading-5">
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Footer info */}
        <View className="mt-8 items-center">
          <Text style={{ color: Colors.textTertiary }} className="text-xs text-center">
            CADE App v1.0.0
          </Text>
          <Text style={{ color: Colors.textTertiary }} className="text-xs text-center mt-1">
            Desarrollado para CADE 2025
          </Text>
        </View>
      </View>
        </View>
      </SafeAreaView>
    </View>
  );
}