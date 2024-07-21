import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NoteCards = ({ title, description, onPress }: { title: string, description: string, onPress: () => void }) => {
  return (
    <View className='w-full py-5 px-4 mt-4 rounded-lg bg bg-indigo-300'>
      <TouchableOpacity onPress={onPress}>
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className={`font-bold text-lg ${new Date().getHours() >= 18 ? 'text-slate-800' : 'text-white'}`}>{title}</Text>
            <View className='w-2/2'>
              <Text 
                style={{
                  fontWeight: 'normal',
                  fontSize: 14,
                  color: new Date().getHours() >= 18 ? '#1E293B' : '#7C83A4',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {description.length > 30 ? description.substring(0, 30) + '...' : description}
              </Text>
            </View>
          </View>
          <Icon 
            name='chevron-right'
            size={24}
            color={new Date().getHours() >= 18 ? '#1E293B' : '#7C83A4'}
          />
        </View>
        
      </TouchableOpacity>
      
    </View>
  )
}

export default NoteCards;