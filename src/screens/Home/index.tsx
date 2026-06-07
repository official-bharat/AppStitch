import { View, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home: React.FC = () => {
  const { fullName } = useRoute().params as { fullName: string };
  return (
    <SafeAreaView>
      <Text>Welcome Back {fullName}</Text>
    </SafeAreaView>
  );
};

export default Home;
