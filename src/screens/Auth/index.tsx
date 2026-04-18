import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';
import { LoginScreen } from './Login';
import { SignupScreen } from './Signup';

export const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };
  const handleLoginPress = () => {
    handleTabPress('login');
  };
  const handleRegisterPress = () => {
    handleTabPress('register');
  };
  const isRegister = activeTab === 'register';
  const isLogin = activeTab === 'login';

  return (
    <SafeAreaView style={styles.safeareaView}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Login to your account</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={handleLoginPress}
            style={isLogin ? styles.toggleView : styles.toggleUnselectView}
          >
            <Text style={isLogin ? styles.activeText : styles.inactiveText}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegisterPress}
            style={isRegister ? styles.toggleView : styles.toggleUnselectView}
          >
            <Text style={isRegister ? styles.activeText : styles.inactiveText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
        {isLogin ? <LoginScreen /> : <SignupScreen />}
      </View>
    </SafeAreaView>
  );
};
