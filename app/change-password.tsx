import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { passwordApi } from '@/services/api/password';

export default function ChangePasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      await passwordApi.sendOTP(email);
      Alert.alert(
        'Código enviado',
        'Se ha enviado un código de verificación a tu correo electrónico',
        [{ text: 'OK', onPress: () => setStep(2) }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el código de verificación');
      return;
    }

    setLoading(true);
    try {
      await passwordApi.verifyOTP(email, otp);
      setStep(3);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await passwordApi.resetPassword(email, otp, newPassword);
      Alert.alert(
        'Éxito',
        'Contraseña actualizada correctamente',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-gray-600 mb-6 text-center">
              Ingresa tu correo electrónico para recibir un código de verificación
            </Text>
            <View className="mb-6">
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
            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleSendEmail}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Enviando...' : 'Enviar Código'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="text-gray-600 mb-6 text-center">
              Ingresa el código de 4 dígitos que enviamos a tu correo
            </Text>
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Código de verificación
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50 text-center text-xl tracking-widest"
                placeholder="0000"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <TouchableOpacity
              className={`py-3 px-6 rounded-lg mb-4 ${
                loading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStep(1)}
              className="py-2"
            >
              <Text className="text-blue-600 text-center">
                Volver a enviar código
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="text-gray-600 mb-6 text-center">
              Ingresa tu nueva contraseña
            </Text>
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Nueva contraseña
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50"
                placeholder="Ingrese nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Confirmar contraseña
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50"
                placeholder="Confirme nueva contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              router.back();
            }
          }}
          className="mr-4"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800">
          Recuperar Contraseña
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            <View className="w-full">
              <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {step === 1 && 'Enviar Código'}
                {step === 2 && 'Verificar Código'}
                {step === 3 && 'Nueva Contraseña'}
              </Text>
              
              {/* Step Indicator */}
              <View className="flex-row justify-center mb-8">
                {[1, 2, 3].map((stepNumber) => (
                  <View
                    key={stepNumber}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-1 ${
                      stepNumber === step
                        ? 'bg-blue-600'
                        : stepNumber < step
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        stepNumber <= step ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </Text>
                  </View>
                ))}
              </View>

              {renderStepContent()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}