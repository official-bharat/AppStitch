import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen } from '../screens/Map/Map';
import { AuthScreen } from '../screens/Auth';
import { TabAnimation } from '../screens/Home';

const Stack = createNativeStackNavigator();

export const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabAnimation"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={MapScreen} />
      <Stack.Screen name="TabAnimation" component={TabAnimation} />
    </Stack.Navigator>
  );
};
