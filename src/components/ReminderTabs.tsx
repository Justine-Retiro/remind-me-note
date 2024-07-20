import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

interface ReminderTabsProps {
  id: string;
  title: string;
  desc?: string;
  time: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
  status: 'pending' | 'done';
  onRepeat: (id: string, frequency: 'daily' | 'custom') => void;
  onDelete: (id: string) => void;
}

const ReminderTabs: React.FC<ReminderTabsProps> = ({ 
  id, title, desc, time, onSelect, isSelected, status, onRepeat, onDelete 
}) => {
  const formattedTime = moment(time).format('MMMM Do YYYY, h:mm:ss a');
  const isDone = status === 'done';

  const handlePress = () => {
    if (status !== 'done') {
      onSelect(id);
    }
  };

  const handleLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Alert.alert(
        "Delete Reminder",
        "Are you sure you want to delete this reminder?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Delete", onPress: () => onDelete(id), style: "destructive" }
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <LongPressGestureHandler onHandlerStateChange={handleLongPress} minDurationMs={800}>
      <View>
        <TouchableOpacity 
          className={`w-full mr-2 ${isDone ? 'opacity-50' : ''}`} 
          onPress={handlePress}
          disabled={isDone}
        >
          <View className='w-full py-2 px-4 my-2 bg-transparent'>
            <View className='flex-row items-center'>
              <Icon 
                name={isDone ? 'check-circle' : isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={isDone ? '#4CAF50' : isSelected ? '#8E97FD' : '#8E97FD'}
              />
              <View className='ml-2 flex-1'>
                <View>
                  <Text className={`font-bold text-lg ${new Date().getHours() >= 18 ? 'text-slate-100' : 'text-white'} ${isDone ? 'line-through' : ''}`}>{title}</Text>
                  {desc && <Text className={`font-regular text-sm ${new Date().getHours() >= 18 ? 'text-slate-300' : 'text-[#7C83A4]'} ${isDone ? 'line-through' : ''}`}>{desc}</Text>}
                  <Text className={`font-regular text-sm ${new Date().getHours() >= 18 ? 'text-slate-300' : 'text-[#7C83A4]'}`}>{formattedTime}</Text>  
                </View>
              </View>
              <View className='flex-col items-center'>
                {isDone && (
                  <View className='ml-auto'>
                    <Text className='text-green-500'>Completed</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </LongPressGestureHandler>
  );
}

export default ReminderTabs;