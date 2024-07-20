import { Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ButtonProps {
  text: string;
  onPress?: () => void;
}

export const ButtonNavigation: React.FC<ButtonProps> = ({ text, onPress, icon } :  {text: string, onPress: () => void, icon: string }) => {
  return (
    <TouchableOpacity className='px-4 py-4 w-auto bg-[#8E97FD] flex flex-row justify-between items-center rounded-2xl ' onPress={onPress}>
      <Text className='text-white ml-1 font-semibold text-base'>{text}</Text>
      <Icon name={icon} size={24} color="white" />
    </TouchableOpacity>
  )
}