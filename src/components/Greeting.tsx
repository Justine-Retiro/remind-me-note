import { View, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { saveUserData, loadUserData } from '../utils/userDataManager';
import * as Font from 'expo-font';
import { Appearance } from 'react-native';
import MoodButton from './MoodDisplay';
import { useNavigation } from '@react-navigation/native';

const Greeting = ({ userData, greeting }) => {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate('Boot');
  };

  return (
    <View style={{ width: '100%', height: 'auto' }}>
      <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text className={`font-regular text-3xl ${new Date().getHours() >= 18 ? 'text-white' : 'text-black'}`}>
            {greeting},
          </Text>
          <Text className={`font-bold text-3xl ${new Date().getHours() >= 18 ? 'text-white' : 'text-black'}`}>
            {userData.userName}
          </Text>
        </View>
        <MoodButton
          mood={userData.mood}
          onPress={handleButtonPress}
        />
      </View>
    </View>
  );
};

export default Greeting;