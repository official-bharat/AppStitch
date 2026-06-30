import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen } from '../screens/Map/Map';
import { AuthScreen } from '../screens/Auth';
import { TabAnimation } from '../screens/TabAnimation';
import Home from '../screens/Home';
import { AppleMusicGradient } from '../screens/AppleMusicGradient';

const Stack = createNativeStackNavigator();

export const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="AppleMusicGradient"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="TabAnimation" component={TabAnimation} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AppleMusicGradient" component={AppleMusicGradient} />
    </Stack.Navigator>
  );
};
