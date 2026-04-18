import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

export const MapScreen: React.FC = () => {
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};
