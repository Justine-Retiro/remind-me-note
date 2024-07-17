import { View, Text, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
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
import HeaderBottom from './components/HeaderBottom';
import moment from 'moment';
import NoteCards from './components/NoteCards';
import ReminderTabs from './components/ReminderTabs';
import { Button } from './components/Button';
import { ReminderAdd } from './ReminderAdd';


export const Main = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userData, setUserData] = useState({ userName: '', mood: '' });
  const [greeting, setGreeting] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Notes');
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dates, setDates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const daysInMonth = [];
    let day = startOfMonth;

    while (day <= endOfMonth) {
      daysInMonth.push(day.clone());
      day = day.clone().add(1, 'd');
    }
    setDates(daysInMonth);

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
    try {
      const storedData = await loadUserData();
      if (storedData) {
        setUserData(storedData);
        setGreeting(getGreeting());
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStoredData();
    setRefreshing(false);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (month) => {
    setSelectedDate(month);
  };

  const handleAddNavigation = () => {
    if(selectedFilter === 'Notes') {
      navigation.navigate('NoteAdd');
    } else {
      navigation.navigate('ReminderAdd');
    }
  }

  const filters = [
    { name: 'Notes', icon: 'notes' },
    { name: 'Reminder', icon: 'radio-button-on' }
  ];

  return (
    <View className={`w-screen h-screen ${new Date().getHours() >= 18 ? 'bg-[#03174C]' : 'bg-white'}`}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 items-center px-3 ">
          {/* BG */}
          <View className="mt-16">
            <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
              <Image
                className={`w-screen ${new Date().getHours() >= 18 ? 'top-24 -z-10' : '-bottom-full'}`}
                source={new Date().getHours() >= 18 ? require('../assets/night-cloud.png') : require('../assets/bg2.png')}
                resizeMode="cover"
              />
            </View>
            <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
              <Image
                className={`w-screen ${new Date().getHours() >= 18 ? 'top-24' : 'hidden'}`}
                source={require('../assets/moon.png')}
                resizeMode="contain"
              />
            </View>
          </View>
          {/* Dashboard */}
          <Greeting userData={userData} greeting={greeting} />
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
          {selectedFilter === 'Reminder' && (
            <HeaderBottom
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
            />
          )}
          {selectedFilter === 'Notes' && <NoteCards />}
          {selectedFilter === 'Reminder' && <ReminderTabs />}

          <View className='mt-32 w-full'>
            <Button text={selectedFilter === 'Notes' ? 'Add Note' : 'Add Reminder'} icon="add-circle" onPress={handleAddNavigation} />
          </View>
        </View>
        <StatusBar style={new Date().getHours() >= 18 ? 'light' : 'dark'} />
      </ScrollView>
    </View>
  );
};