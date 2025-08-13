import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react-native";
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20; // padding horizontal del contenedor
const TAB_BAR_PADDING = 10; // padding horizontal del tabBar
const AVAILABLE_WIDTH = width - (CONTAINER_PADDING * 2) - (TAB_BAR_PADDING * 2);
const TAB_WIDTH = AVAILABLE_WIDTH / 5;

const icons = {
  sections: Calendar,
  speakers: Users,
  index: Home,
  chat: MessageCircle,
  favorites: MoreHorizontal,
};

const tabOrder = ['sections', 'speakers', 'index', 'chat', 'favorites'];

// Componente para iconos animados
const AnimatedIcon = ({ IconComponent, isFocused, color }: {
  IconComponent: React.ComponentType<any>;
  isFocused: boolean;
  color: string;
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      // Animación de bounce cuando se selecciona
      scale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withSpring(1.1, { damping: 8, stiffness: 100 })
      );
      // Pequeña rotación para darle más dinamismo
      rotation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    } else {
      scale.value = withSpring(1, { damping: 8, stiffness: 100 });
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={24} color={color} />
    </Animated.View>
  );
};

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(0);
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];
  const tabBarBg = colors.tabBarBackground;
  const circleBg = colors.tabActiveBackground;
  const activeColor = colors.tabActiveColor;
  const inactiveColor = colors.tabInactiveColor;

  useEffect(() => {
    const activeIndex = state.index;
    // El círculo necesita estar centrado en cada tab
    // TAB_BAR_PADDING (10px) + posición del tab + centrado del círculo
    const circlePosition = TAB_BAR_PADDING + (activeIndex * TAB_WIDTH) + (TAB_WIDTH / 2) - ((TAB_WIDTH - 10) / 2);
    translateX.value = withSpring(circlePosition, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
  }, [state.index]);

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: tabBarBg }]}>
        {/* Círculo animado de fondo */}
        <Animated.View style={[styles.circle, circleStyle, { backgroundColor: circleBg }]} />
        
        {/* Tabs */}
        {tabOrder.map((routeName, index) => {
          const route = state.routes.find(r => r.name === routeName);
          if (!route) return null;
          
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const IconComponent = icons[routeName as keyof typeof icons];

          return (
            <TouchableOpacity
              key={routeName}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <AnimatedIcon 
                IconComponent={IconComponent}
                isFocused={isFocused}
                color={isFocused ? activeColor : inactiveColor}
              />
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
    bottom: 30,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
  circle: {
    position: 'absolute',
    width: TAB_WIDTH - 10,
    height: 45,
    borderRadius: 22.5,
    top: 12.5,
    left: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
});