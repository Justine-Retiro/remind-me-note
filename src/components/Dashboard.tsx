import { View, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconGlass from 'react-native-vector-icons/Fontisto';
import IconAlarm from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';

const date = new Date();
const today = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const StyledTouchableOpacity = styled(TouchableOpacity);

const Dashboard = () =>  {
  return (
    <View className='w-full mt-3'>
        <View className='flex-row '>
            <View className='flex-1 mr-4'>
                <StyledTouchableOpacity className='w-full p-6 bg-violet-300 rounded-3xl'>
                    <Text className='text-white text-sm font-light'>{today}</Text>
                    <Text className='text-white text-sm font-bold'>Friday</Text>
                    <Text className='text-white text-4xl font-bold '>Today</Text>
                    <View className='flex-row items-center'>
                        <View className='bg-white/30 p-2 rounded-xl mr-2'>
                            <IconAlarm name="alarm-outline" size={28} color="white"/>
                        </View>
                        <View className='flex items-start'>
                            <Text className='text-white text-xl font-bold'>2</Text>
                            <Text className='text-white text-sm font-regular'>Today's event</Text>
                        </View>
                    </View>
                </StyledTouchableOpacity>
            </View>
            
            <View className="flex-1 h-auto justify-between">
                <StyledTouchableOpacity className="flex-row items-center bg-[#B2B9FF] p-4 rounded-2xl">
                    <View className="bg-[#8E97FD] p-2 aspect-square rounded-lg mr-3">
                        <View className="bg-[#B2B9FF] p-1 rounded-xl">
                            <Icon name="check" size={15} color="white" />
                        </View>
                    </View>
                    <View>
                        <Text className="text-white text-xl font-semibold">20</Text>
                        <Text className="text-white text-sm">Completed</Text>
                    </View>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity className="flex-row items-center bg-[#FFB2C9] p-4 rounded-2xl">
                    <View className="bg-[#FE8FB0] p-3 rounded-lg mr-3">
                        <View className=" rounded-xl">
                            <IconGlass name="hourglass-end" size={15} color="white" />
                        </View>
                    </View>
                    <View>
                        <Text className="text-white text-2xl font-semibold">2</Text>
                        <Text className="text-white text-sm">Pending</Text>
                    </View>
                </StyledTouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default Dashboard;