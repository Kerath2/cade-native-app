import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react-native";

const icons = {
  sections: Calendar,
  speakers: Users,
  index: Home,
  chat: MessageCircle,
  favorites: MoreHorizontal,
};

const tabOrder = ['sections', 'speakers', 'index', 'chat', 'favorites'];

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabOrder.map((routeName, index) => {
          const route = state.routes.find(r => r.name === routeName);
          if (!route) return null;

          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index].name === routeName;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconComponent = icons[routeName as keyof typeof icons];

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={1}
            >
              <View style={[
                styles.iconContainer,
                isFocused && styles.iconContainerActive
              ]}>
                {IconComponent && (
                  <IconComponent
                    size={24}
                    color={isFocused ? "#FFFFFF" : "#888888"}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#eff3f6',
    paddingBottom: 34,
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#eff3f6',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 60,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  iconContainerActive: {
    backgroundColor: '#2c3c94',
  },
});