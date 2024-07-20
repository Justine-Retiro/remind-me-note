import { View, Text } from 'react-native'
import React from 'react'

const NoteCards = ({ title, description }: { title: string, description: string }) => {
  
  return (
    <View className='w-full py-5 px-4 mt-4 rounded-lg bg bg-indigo-300'>
      <Text className={`font-bold text-lg ${new Date().getHours() >= 18 ? 'text-slate-800' : 'text-white'}`}>{title}</Text>
      <Text 
        className={`font-regular text-sm ${new Date().getHours() >= 18 ? 'text-slate-800' : 'text-[#7C83A4]'}`}
        numberOfLines={1} ellipsizeMode="tail">
        {description}
      </Text>
    </View>
  )
}
export default NoteCards;