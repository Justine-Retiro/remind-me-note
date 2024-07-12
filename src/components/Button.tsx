import { Text, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Font from 'expo-font';

interface ButtonProps {
  text: string;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <Pressable className='px-4 py-4 bg-[#8E97FD] flex items-center rounded-lg ' onPress={onPress}>
      <Text className='text-white'>{text}</Text>
    </Pressable>
  )
}