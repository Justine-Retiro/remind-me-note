import { View, Text, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NativeWindStyleSheet } from 'nativewind';
import { Button } from './components/Button';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { saveUserData, loadUserData } from './utils/userDataManager';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export const Splash = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [text, onChangeText] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const saveProgress = async () => {
    try {
      await saveUserData({ firstTime: false });
    } catch (e) {
      console.error('Failed to save the name to file');
    }
  };

  // const loadName = async () => {
  //   try {
  //     const userData = await loadUserData();
  //     if (userData && userData.userName) {
  //       onChangeText(userData.userName);
  //     }
  //   } catch (e) {
  //     console.error('Failed to load the name from file');
  //   }
  // };

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'SF-Pro-Text-Semibold' : require('../assets/fonts/SF-Pro-Text-Semibold.otf'),
        'SF-Pro-Display-Medium': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
        'SF-Pro-Display-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
        'SF-Pro-Display-Regular': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
    // loadName();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const handleGetStarted = () => {
    saveProgress();
    navigation.navigate('Boot');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-screen h-screen">
        <View style={{ flex: 1, alignItems: 'center', backgroundColor }}>
          <View className="mt-[140px]">
            <Image
                source={require('../assets/note.png')}
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
            />
          </View>
         
          <View className='h-auto p-2 w-full mt-[75px]'>
              <Text style={{ color: textColor }} className="font-bold text-[41px] text-center">Welcome to the</Text>
              <Text style={{ color: textColor }} className="mb-[35px] font-bold text-[41px] text-center">Remind Me Note!</Text>
              <View className='mb-[45px] mx-6'>
                  <Text style={{ color: textColor }} className="font-regular text-center mb-2.5">
                    Welcome to Remind Me Note, your personal memory assistant!
                  </Text>
                  <Text style={{ color: textColor }} className="font-regular text-center mb-2.5">
                    We're here to help you stay organized and on top of your tasks, especially if you find yourself easily forgetting important details.
                  </Text>
                  <Text style={{ color: textColor }} className="font-regular text-center mb-2.5">
                    With our app, you can effortlessly create notes and set reminders, ensuring you never miss a beat in your busy life.
                  </Text>
              </View>
              <View className='mx-6'>
                <Button text='Get Started' onPress={handleGetStarted} />
              </View>
          </View>
        </View>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};