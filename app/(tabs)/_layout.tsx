import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Users, Calendar, MessageCircle, Heart } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  IconComponent: React.ComponentType<any>;
  color: string;
  size?: number;
}) {
  const { IconComponent, size = 24, ...otherProps } = props;
  return <IconComponent size={size} {...otherProps} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'CADE Ejecutivos 2025',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Home} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sections"
        options={{
          title: 'Secciones',
          headerTitle: 'Secciones',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Calendar} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speakers"
        options={{
          title: 'Speakers',
          headerTitle: 'Speakers',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Users} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerTitle: 'Chat',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={MessageCircle} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          headerTitle: 'Favoritos',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Heart} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
