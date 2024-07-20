import { View, Text, Image, TextInput, Alert, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NativeWindStyleSheet } from 'nativewind';
import { Button } from './components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoodButton from './components/MoodBtn';
import { saveUserData, loadUserData } from './utils/userDataManager';
import { useNavigation } from '@react-navigation/native';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export const Boot = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [storedName, setStoredName] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [userData, setUserData] = useState({ mood: '' });
  const navigation = useNavigation();
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
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    const storedData = await loadUserData();
    if (storedData) {
      setUserData(storedData);
    }
  };

  const handleMoodSelection = async (mood) => {
    const newUserData = { ...userData, mood };
    setUserData(newUserData);
    console.log(newUserData);
    await saveUserData(newUserData);
  };

  const moods = ['☹️', '🙁', '😐', '🙂', '😃'];

  const handleButtonPress = async () => {
    if (!userData.mood) {
      Alert.alert('Please select a mood before continuing');
      return;
    }

    try {
      await saveUserData(userData);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }


  return (
    <View className={`w-screen h-screen ${new Date().getHours() >= 18 ? 'bg-[#03174C]' : 'bg-[#8E97FD]'}`}>
        <View className="flex-1 items-center">
            <View className="mt-16">
              <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
                  <Image
                    className={`w-screen ${new Date().getHours() >= 18 ? 'hidden' : '-bottom-full'}`}
                    source={require('../assets/bg2.png')}
                    resizeMode="cover"
                />
              </View>
            </View>
            <View className='h-auto px-[4px] mt-32'>
                <View className='mb-12'>
                  <Text className={`font-bold text-[32px] text-center ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-800'}`}>Hi Welcome</Text>
                  <Text className={`mb-[55px] text-center font-regular text-[32px] ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-800'}`}>to Re:note Mind</Text>
                </View>
                
                <View className='mb-[45px]'>
                  <Text className={`font-semiBold text-center ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-800'}`}>How are you today?</Text>
                  <View className="flex-row justify-center mt-4">
                    {moods.map((mood) => (
                      <MoodButton
                        key={mood}
                        mood={mood}
                        onPress={handleMoodSelection}
                        isSelected={userData.mood === mood}
                      />
                    ))}
                  </View>
                </View>
                <View className='px-4 mt-24'>
                  <Button text='Continue' onPress={handleButtonPress}/>
                </View>
                
            </View>
            <View className="absolute bottom-0 left-0 right-0 -z-10 items-center">
            <Image
                className={`${new Date().getHours() >= 18 ? 'w-screen scale-110' : 'w-screen scale-150 -bottom-1/4'}`}
                source={new Date().getHours() >= 18 ? require('../assets/bg-1.png') : require('../assets/elipse.png')}
                resizeMode="contain"
            />
            </View>
        </View>
    </View>
  );
};