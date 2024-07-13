import { View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { saveUserData, loadUserData } from './utils/userDataManager';
import * as Font from 'expo-font';
import { Appearance } from 'react-native';
import MoodButton from './components/MoodDisplay';


export const Note = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userData, setUserData] = useState({ userName: '', mood: ''});
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'SF-Pro-Text-Semibold': require('../assets/fonts/SF-Pro-Text-Semibold.otf'),
          'SF-Pro-Display-Medium': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
          'SF-Pro-Display-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
          'SF-Pro-Display-Regular': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
        });
        setFontsLoaded(true);

        // Load user data
        const storedData = await loadUserData();
        if (storedData) {
          setUserData(storedData);
        }

        // Set greeting
        setGreeting(getGreeting());
      } catch (error) {
        console.error('Error in prepare function:', error);
      }
    }

    prepare();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  


  const loadStoredData = async () => {
    const storedData = await loadUserData();
    if (storedData) {
      setUserData(storedData);
    }
  };

  return (
    <View className="w-screen h-screen bg-white">
        <View className="flex-1 items-center">
            <View className="mt-16">
              <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
                  <Image
                    className='w-screen -bottom-full'
                    source={require('../assets/bg2.png')}
                    resizeMode="cover"
                />
              </View>
            </View>
            <View className='w-full px-[20px] flex-1 justify-start'>
                <View className='flex flex-row justify-between'>
                  <View>
                    <Text className="font-regular text-start text-[32px] text-slate-800">{greeting},</Text>
                    <Text className="text-start font-bold text-[32px] text-slate-800 capitalize">{userData.userName}</Text>
                  </View>
                      <MoodButton
                        mood={userData.mood}
                      />
                </View>
            </View>
            <View className="absolute bottom-0 left-0 right-0 -z-10 items-center">
            <Image
                className="w-screen scale-150 -bottom-1/4"
                source={require('../assets/elipse.png')}
                resizeMode="contain"
            />
            </View>
        </View>
    </View>
  )
}