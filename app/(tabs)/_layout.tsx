import { Tabs } from 'expo-router';
import React from 'react';
import { Home, Users, Calendar, MessageCircle, MoreHorizontal } from 'lucide-react-native';
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
        headerShown: false,
      }}>
      <Tabs.Screen
        name="sections"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Calendar} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speakers"
        options={{
          title: 'Expositores',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Users} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Home} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={MessageCircle} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Más',
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={MoreHorizontal} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
