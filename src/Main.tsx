import { View, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { saveUserData, loadUserData } from './utils/userDataManager';
import * as Font from 'expo-font';
import { Appearance } from 'react-native';
import MoodButton from './components/MoodDisplay';
import { StatusBar } from 'expo-status-bar';
import Greeting from './components/Greeting';
import Dashboard from './components/Dashboard';
import ButtonSort from './components/ButtonSort';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export const Main = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userData, setUserData] = useState({ userName: '', mood: ''});
  const [greeting, setGreeting] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Notes');
  const navigation = useNavigation();
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

  

  const filters = [
    { name: 'Notes', icon: 'notes' },
    { name: 'Reminder', icon: 'radio-button-on' }
  ];

  return (
    <View className="w-screen h-screen bg-white">
      <View className="flex-1 items-center px-3 ">
        {/* BG */}
        <View className="mt-16">
          <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
            <Image
              className='w-screen -bottom-full'
              source={require('../assets/bg2.png')}
              resizeMode="cover"
            />
          </View>
        </View>
        {/* Dashboard */}
        <Greeting/>
        <Dashboard />
        <View className="flex flex-row mt-6 w-full justify-between">
          {filters.map((filter) => (
            <ButtonSort
              key={filter.name}
              filter={filter.name}
              icon={filter.icon}
              isSelected={selectedFilter === filter.name}
              onPress={() => setSelectedFilter(filter.name)}
            />
          ))}
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};