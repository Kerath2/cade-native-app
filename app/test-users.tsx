import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

export default function TestUsersPage() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2c3c94' }}>
      <View style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', marginLeft: 10 }}>Volver</Text>
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>
          Test Users Page
        </Text>

        <Text style={{ color: '#FFFFFF', marginTop: 20 }}>
          Si puedes ver esta pantalla, la navegación funciona correctamente.
        </Text>
      </View>
    </SafeAreaView>
  );
}