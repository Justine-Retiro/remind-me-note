import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';


const ReminderTabs = ({ title, time } : { title: string, time: string }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <TouchableOpacity className='w-full mr-2' onPress={() => setIsSelected(!isSelected)}>

    <View className='w-full py-2 px-4 mt-5  rounded-lg bg-transparent'>
      <View className='flex-row items-center'>
          <Icon name={isSelected ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={isSelected ? '#8E97FD' : '#8E97FD'}
          />
        <View className='ml-2'>
          <Text className={`font-bold text-lg ${new Date().getHours() >= 18 ? 'text-slate-100' : 'text-white'}`}>{title}</Text>
          <Text className={`font-regular text-sm ${new Date().getHours() >= 18 ? 'text-slate-300' : 'text-[#7C83A4]'}`}>{time}</Text>  
        </View>
      </View>
    </View>
    </TouchableOpacity>
  )
}
export default ReminderTabs;