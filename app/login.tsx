import React, { useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo Section */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                CADE Ejecutivos
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                2025
              </Text>
            </View>

            {/* Login Form */}
            <View className="w-full">
              <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Iniciar Sesión
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">
                  Correo electrónico
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50"
                  placeholder="Ingrese su correo"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">
                  Contraseña
                </Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50 pr-12"
                    placeholder="Ingrese su contraseña"
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
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`py-3 px-6 rounded-lg mb-4 ${
                  loading ? 'bg-gray-400' : 'bg-blue-600'
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => router.push('/change-password')}
                className="py-2"
              >
                <Text className="text-blue-600 text-center font-medium">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}