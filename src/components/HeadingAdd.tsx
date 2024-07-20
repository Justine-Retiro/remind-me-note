import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const HeadingAdd = ({ title, onPress } : { title: string, onPress: () => void }) => {
    const navigation = useNavigation();
    

    const handleBack = () => {
        navigation.goBack();
    }
    
  return (
    <View className='w-full mt-12 flex-row justify-between items-center'>
        <TouchableOpacity onPress={handleBack}>
            <Icon name='arrow-back' size={30} color='#8E97FD' />
        </TouchableOpacity>
        <Text className={`text-lg font-regular ${new Date().getHours() >= 18 ? 'text-white' : ' text-black'}`}>{title}</Text>
        <TouchableOpacity 
          onPress={onPress}
          >
          <Text className={`text-lg font-semibold ${new Date().getHours() >= 18 ? 'text-[#8E97FD]' : ' text-[#8E97FD]'}`}>Add</Text>
        </TouchableOpacity>
    </View>
  )
}

export default HeadingAdd;