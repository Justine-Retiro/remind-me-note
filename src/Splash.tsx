import { View, Text, Image, TextInput, Alert, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NativeWindStyleSheet } from 'nativewind';
import { Button } from './components/Button';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export const Splash = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [text, onChangeText] = React.useState('');

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
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const handleButtonPress = () => {
    // Add your button press logic here
    console.log('Button pressed');
  };

  return (
    <View className="w-screen h-screen">
      <View className="flex-1 items-center justify-center">
        <Image 
            className='absolute top-12 z-10'
            source={require('../assets/splashAvatar.png')}
        />
        <Image
            className='absolute bottom-10 -z-0 scale-125'
            source={require('../assets/bgShape.png')}
        />
        <View className='h-auto p-2'>
            <Text className="mb-[55px] font-bold text-[24px] text-slate-800">Let's get to know each other!</Text>
            <View className='mb-[45px]'>
                <Text className='font-semiBold text-[#A1A4B2]'>What should we call you?</Text>
                <TextInput 
                    onChangeText={onChangeText}
                    className='p-3 h-[54px] bg-[#F2F3F7] rounded-lg'
                    value={text}
                />
            </View>
            <Button text='Get Started' onPress={handleButtonPress} />
        </View>
      </View>
    </View>
  );
};