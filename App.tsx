import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import { Splash } from './src/Splash';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'SF-Pro-Text-Semibold' : require('./assets/fonts/SF-Pro-Text-Semibold.otf'),
        'SF-Pro-Display-Medium': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
        'SF-Pro-Display-Bold': require('./assets/fonts/SF-Pro-Display-Bold.otf'),
        'SF-Pro-Display-Regular': require('./assets/fonts/SF-Pro-Display-Regular.otf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={{ flex: 1 }}>
      <Splash />
    </View>
  );
}