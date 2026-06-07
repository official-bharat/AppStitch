import { Alert, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../services/storage';

const Home: React.FC = () => {
  const { fullName } = useRoute().params as { fullName: string };
  const removeBiometricAuth = async () => {
    await storage.removeItem('biometricAuth');
    Alert.alert('Biometric authentication removed');
  };
  return (
    <SafeAreaView>
      <Text onPress={removeBiometricAuth}>Welcome Back {fullName}</Text>
    </SafeAreaView>
  );
};

export default Home;
