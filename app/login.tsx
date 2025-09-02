import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react-native";
import Colors from "@/constants/Colors";
import Logo from "../assets/images/logoLogin.png";
import LogoFooter from "../assets/images/logoFooter.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const getBackgroundGradient = () => {
    if (colorScheme === "dark") {
      return ['rgb(45,60,150)', 'rgb(35,45,120)', 'rgb(25,35,90)'];
    } else {
      return ['#f53b43', 'rgb(255,217,224)', 'rgb(255,255,255)'];
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={getBackgroundGradient()}
      locations={colorScheme === "dark" ? [0, 0.5, 1] : [0, 0.2, 1]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent"
          translucent={true}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View className="w-full">
            <Image source={Logo} className="w-full h-64" resizeMode="contain" />
          </View>
          <View className="flex-1 px-6 pt-8">
            {/* Login Form */}
            <View className="w-full">
              <Text style={{ color: colors.text }} className="text-2xl font-bold mb-6 text-center">
                Iniciar Sesión
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text style={{ color: colors.text }} className="mb-2 font-medium">
                  Correo electrónico
                </Text>
                <TextInput
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                  className="border rounded-lg px-4 py-3"
                  placeholder="Ingrese su correo"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text style={{ color: colors.text }} className="mb-2 font-medium">
                  Contraseña
                </Text>
                <View className="relative">
                  <TextInput
                    style={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    className="border rounded-lg px-4 py-3 pr-12"
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.textTertiary} />
                    ) : (
                      <Eye size={20} color={colors.textTertiary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: loading ? colors.backgroundTertiary : colors.primary
                }}
                className="py-3 px-6 rounded-lg mb-4"
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={{ color: colors.textInverted }} className="text-center font-semibold text-lg">
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => router.push("/change-password")}
                className="py-2"
              >
                <Text style={{ color: colors.primary }} className="text-center font-medium">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full justify-center align-center items-center">
            <Image
              source={LogoFooter}
              className="w-64 h-32"
              resizeMode="contain"
            />
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
