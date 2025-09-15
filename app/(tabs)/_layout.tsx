import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '@/components/CustomTabBar';

// Importar las pantallas
import IndexScreen from './index';
import SectionsScreen from './sections';
import SpeakersScreen from './speakers';
import ChatScreen from './chat';
import FavoritesScreen from './favorites';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="sections" component={SectionsScreen} />
      <Tab.Screen name="speakers" component={SpeakersScreen} />
      <Tab.Screen name="index" component={IndexScreen} />
      <Tab.Screen name="chat" component={ChatScreen} />
      <Tab.Screen name="favorites" component={FavoritesScreen} />
      <Tab.Screen
        name="session/[id]"
        component={require('../session/[id].tsx').default}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="speaker/[id]"
        component={require('../speaker/[id].tsx').default}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="section/[id]"
        component={require('../section/[id].tsx').default}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}
