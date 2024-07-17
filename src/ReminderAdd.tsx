import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import HeadingAdd from './components/HeadingAdd';
import ButtonSort from './components/ButtonSort';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';

export const ReminderAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedTime, setSelectedTime] = useState('AM');
  const [inputHours, setInputHours] = useState('');
  const [inputMinutes, setInputMinutes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const minutesInputRef = useRef(null);

  const handleInputChangeHours = (text: string) => {
    if (text === '') {
      setInputHours('');
    } else {
      const numericValue = text.replace(/[^0-9]/g, '');
      const limitedValue = numericValue.slice(0, 2);
      const hourValue = parseInt(limitedValue);
  
      if (hourValue >= 0 && hourValue <= 12) {
        setInputHours(limitedValue);
        if (limitedValue.length === 1 && hourValue >= 1 && hourValue <= 9) {
          if (minutesInputRef.current?.focus()) {
            setInputHours(limitedValue.padStart(2, '0'));
          }
        } else if (limitedValue.length === 2) {
          minutesInputRef.current?.focus();
        }
      } else if (hourValue > 12) {
        setInputHours('12');
        minutesInputRef.current?.focus();
      }
    }
  };
  
  const handleInputChangeMinutes = (text: string) => {
    if (text === '') {
      setInputMinutes('');
    } else {
      const numericValue = text.replace(/[^0-9]/g, '');
      const limitedValue = numericValue.slice(0, 2);
      const minuteValue = parseInt(limitedValue);
  
      if (minuteValue >= 0 && minuteValue <= 59) {
        setInputMinutes(limitedValue.padStart(2, ''));
      } else if (minuteValue > 59) {
        setInputMinutes('59');
      }
    }
  };

  const time = [
    { name: 'AM', icon: 'sunny' },
    { name: 'PM', icon: 'nightlight' }
  ];

  const onDateChange = (day) => {
    setSelectedDate(day.dateString);
  };
  const currentDate = new Date().toISOString().split('T')[0];

  const isNight = new Date().getHours() >= 18;

  return (
    <View className={`w-screen h-screen ${isNight ? 'bg-[#03174C]' : 'bg-[#F2F2F2'}`}>
        <ScrollView>
      <View className="flex-1 items-center px-3">
        <HeadingAdd title='New Reminder' />
        <View className='w-full mt-6'>
          <View className='mb-5'>
            <TextInput
              className={`w-full h-[45px] py-1 px-4 border-b font-regular text-[25px] rounded-lg ${isNight ? 'text-white border-slate-100' : 'text-black border-slate-700'}`}
              placeholder='Title'
              placeholderTextColor={isNight ? 'gray' : '#D3D7FF'} 
            />
          </View>

          <View className={`flex flex-row justify-evenly items-center rounded-lg px-2 py-4 ${isNight ? 'bg-[#1f2246]' : 'bg-white'}`}>
            <View className='flex-row items-center '>
              <TextInput
                className={`w-[114px] h-[105px] py-4 px-4 text-[64px] text-center rounded-lg ${isNight ? 'bg-[#1f2246] text-slate-100' : 'focus:border border-[#8E97FD] text-slate-100'} ${inputHours !== '' ? 'bg-[#B2B9FF]' : ''} ${inputHours === '' && isNight ? 'border border-[#8E97FD]' : 'bg-[#F1F2FF]'}`}
                placeholder='00'
                keyboardType='numeric'
                maxLength={2}
                placeholderTextColor={isNight ? 'gray' : '#D3D7FF'}
                value={inputHours}
                onChangeText={handleInputChangeHours}
              />
              <Text className={`text-5xl px-1 font-semibold text-slate-100 ${isNight ? 'text-slate-100' : 'text-slate-900'}`}>:</Text>
              <TextInput
                className={`w-[114px] h-[105px] py-4 px-4 text-[64px] text-center rounded-lg ${isNight ? 'bg-[#1f2246] text-slate-100' : 'focus:border border-[#8E97FD] text-slate-100'} ${inputMinutes !== '' ? 'bg-[#B2B9FF]' : ''} ${inputMinutes === '' && isNight ? 'border border-[#8E97FD]' : 'bg-[#F1F2FF]'}`}
                placeholder='00'
                keyboardType='numeric'
                maxLength={2}
                placeholderTextColor={isNight ? 'gray' : '#D3D7FF'}
                value={inputMinutes}
                onChangeText={handleInputChangeMinutes}
              />
            </View>
            <View className='w-auto flex justify-center items-center'>
              {time.map((timeOption) => (
                <View key={timeOption.name} className='p-1'>
                  <TouchableOpacity
                    onPress={() => setSelectedTime(timeOption.name)}
                    className={`w-[80px] h-[45px] rounded-lg flex flex-row items-center justify-center ${timeOption.name === selectedTime ? 'bg-[#8E97FD]' : 'bg-transparent border border-[#8E97FD]'} ${isNight ? 'border border-[#8E97FD] text-slate-100' : ''}`}
                  >
                    <Icon name={timeOption.icon} size={24} color={timeOption.name === selectedTime ? 'white' : '#8E97FD'} />
                    <Text className={`text-lg ml-2 ${timeOption.name === selectedTime ? 'text-white' : 'text-[#8E97FD]'}`}>
                      {timeOption.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View className={`p-2 mt-6 rounded-lg ${isNight ? 'bg-[#1f2246]' : 'bg-white'}`}>

            <Calendar
                onDayPress={onDateChange}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#8E97FD' },
                }}
                theme={{
                    calendarBackground: isNight ? '#1f2246' : '#fff',
                    textSectionTitleColor: isNight ? '#fff' : '#000',
                    dayTextColor: isNight ? '#fff' : '#000',
                    todayTextColor: '#8E97FD',
                    selectedDayBackgroundColor: '#8E97FD',
                    selectedDayTextColor: '#fff',
                    arrowColor: isNight ? '#fff' : '#000',
                    monthTextColor: isNight ? '#fff' : '#000',
                }}
                minDate={currentDate}
                disableArrowLeft={false}
                disableArrowRight={false}
            />
        </View>
        </View>
      </View>
      </ScrollView>
      <StatusBar style={isNight ? 'light' : 'dark'} />
    </View>
  );
};