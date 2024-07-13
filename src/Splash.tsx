import { View, Text, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
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

  const saveName = async (name) => {
    try {
      await saveUserData({ userName: name });
    } catch (e) {
      console.error('Failed to save the name to file');
    }
  };

  const loadName = async () => {
    try {
      const userData = await loadUserData();
      if (userData && userData.userName) {
        onChangeText(userData.userName);
      }
    } catch (e) {
      console.error('Failed to load the name from file');
    }
  };

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
    loadName();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const saveUserName = () => {
    saveName(text);
    navigation.navigate('Boot');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-screen h-screen">
        <View className="flex-1 items-center bg-white">
          <View className=" mt-16">
            <Image
                source={require('../assets/enjoy.png')}
                resizeMode="cover"
            />
          </View>
         
          <View className='h-auto p-2 mt-[45px]'>
              <Text className="mb-[55px] font-bold text-[24px] text-slate-800">Let's get to know each other!</Text>
              <View className='mb-[45px]'>
                  <Text className='font-semiBold text-[#A1A4B2]'>What should we call you?</Text>
                  <TextInput
                      className='p-3 h-[54px] bg-[#F2F3F7] rounded-lg'
                      onChangeText={(newText) => {
                        onChangeText(newText);
                      }}
                      value={text}
                  />
              </View>
              <Button text='Get Started' onPress={saveUserName} />
          </View>
        </View>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};