import { View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { saveUserData, loadUserData } from '../utils/userDataManager';
import * as Font from 'expo-font';
import { Appearance } from 'react-native';
import MoodButton from './MoodDisplay';
import { useNavigation } from '@react-navigation/native';

const Greeting = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ userName: '', mood: ''});
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    async function prepare() {
      try {
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

  const handleChangeMood = () => {
    navigation.navigate('Boot');
  };

  return (
    <View className="w-full h-auto">
        <View className='px-[20px] flex justify-between'>
            <View className='flex flex-row justify-between'>
                <View>
                  <Text className="font-regular text-start text-[32px] text-slate-800">{greeting},</Text>
                  <Text className="text-start font-bold text-[32px] text-slate-800 capitalize">{userData.userName}</Text>
                </View>
                    <MoodButton
                      mood={userData.mood}
                      onPress={handleChangeMood}
                      isSelected={false}
                    />
            </View>
        </View>
    </View>
  )
}

export default Greeting;