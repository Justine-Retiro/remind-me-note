import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import HeadingAdd from './components/HeadingAdd';
import ButtonSort from './components/ButtonSort';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { addReminder } from './utils/userDataManager';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

export const ReminderAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [selectedTime, setSelectedTime] = useState('AM');
  const [selectedRepeat, setSelectedRepeat] = useState('None');
  const [inputHours, setInputHours] = useState('');
  const [inputMinutes, setInputMinutes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();

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

  const repeat = [
    { name: 'None' },
    { name: 'Daily' },
    { name: 'Weekly' },
    { name: 'Monthly' },
    { name: 'Yearly' }
  ];

  const getMarkedDates = () => {
    const marked = {
      [selectedDate]: { selected: true, selectedColor: '#8E97FD' },
    };

    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const addMonths = (date, months) => {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    };

    const addYears = (date, years) => {
      const result = new Date(date);
      result.setFullYear(result.getFullYear() + years);
      return result;
    };

    const isValidDate = (date) => !isNaN(date.getTime());

    if (selectedRepeat === 'Daily') {
      for (let i = 1; i <= 365; i++) {
        const nextDate = addDays(selectedDate, i);
        if (isValidDate(nextDate)) {
          const formattedDate = nextDate.toISOString().split('T')[0];
          marked[formattedDate] = { marked: true, dotColor: '#8E97FD' };
        }
      }
    } else if (selectedRepeat === 'Weekly') {
      for (let i = 1; i <= 52; i++) {
        const nextDate = addDays(selectedDate, i * 7);
        if (isValidDate(nextDate)) {
          const formattedDate = nextDate.toISOString().split('T')[0];
          marked[formattedDate] = { marked: true, dotColor: '#8E97FD' };
        }
      }
    } else if (selectedRepeat === 'Monthly') {
      for (let i = 1; i <= 12; i++) {
        const nextDate = addMonths(selectedDate, i);
        if (isValidDate(nextDate)) {
          const formattedDate = nextDate.toISOString().split('T')[0];
          marked[formattedDate] = { marked: true, dotColor: '#8E97FD' };
        }
      }
    } else if (selectedRepeat === 'Yearly') {
      for (let i = 1; i <= 5; i++) {
        const nextDate = addYears(selectedDate, i);
        if (isValidDate(nextDate)) {
          const formattedDate = nextDate.toISOString().split('T')[0];
          marked[formattedDate] = { marked: true, dotColor: '#8E97FD' };
        }
      }
    }

    return marked;
  };

  const onDateChange = (day) => {
    setSelectedDate(day.dateString);
  };

  const currentDate = new Date().toISOString().split('T')[0];

  const isNight = new Date().getHours() >= 18;

  const scheduleReminder = async () => {
    const selectedDateTime = parse(
      `${selectedDate} ${inputHours}:${inputMinutes} ${selectedTime}`,
      'yyyy-MM-dd hh:mm a',
      new Date()
    );

    // Validate AM/PM input
    const hourValue = parseInt(inputHours);
    if ((selectedTime === 'AM' && (hourValue < 1 || hourValue > 12)) || 
        (selectedTime === 'PM' && (hourValue < 1 || hourValue > 12))) {
      alert('Invalid time input for the selected AM/PM period.');
      return;
    }
  
    try {
      const newReminder = await addReminder({
        title: inputValue,
        description: inputDescription,
        dateTime: selectedDateTime.toISOString(),
        status: 'pending',
        frequency: selectedRepeat,
        repeatDays: selectedRepeat,
        repeatTime: selectedTime,
      });
  
      // Reset form fields after saving the reminder
      setInputValue('');
      setSelectedTime('AM');
      setInputHours('');
      setInputMinutes('');
      setSelectedDate('');
      console.log('Reminder added successfully!');
      // alert('Reminder added successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Failed to add reminder. Please try again.');
    }
  };

  return (
    <View className={`w-screen h-screen ${isNight ? 'bg-[#03174C]' : 'bg-[#F2F2F2]'}`}>
      <View className="sticky top-0 left-0 right-0">
        <BlurView
          intensity={0}
          tint="default"
          className="overflow-hidden"
        >
          <View className="w-full -mt-2 pb-3.5 px-4 ">
            <HeadingAdd 
              title='New Reminder'
              onPress={scheduleReminder}
            />
          </View>
        </BlurView>
      </View>
      <ScrollView>
        <View className="flex-1 items-center px-3">
          <View className='w-full h-full mb-20'>
            <View className='mb-5'>
              <TextInput
                className={`w-full h-[45px] py-1 px-1 font-regular text-[25px] 
                ${isNight ? 'text-white border-[#2b1ea5] focus:border-blue-600' 
                : 'text-black  border-b border-slate-100 focus:border-slate-700'}`}
                placeholder='Title'
                placeholderTextColor={isNight ? '#D3D7FF' : 'gray'}
                value={inputValue}
                onChangeText={setInputValue}
              />
            </View>
            <View className='mb-5 h-[80px]'>
              <TextInput
                className={`w-full h-full p-2 font-regular text-[15px] rounded-lg 
                ${isNight ? 'text-white border-[#2b1ea5] focus:border-blue-600' : 
                'text-black border border-slate-100 focus:border-slate-700'}`}
                placeholder='Description'
                placeholderTextColor={isNight ? '#D3D7FF' : 'gray'}
                value={inputDescription}
                multiline = {true}
                numberOfLines = {4}
                onChangeText={setInputDescription}
              />
            </View>

            <View className={`flex flex-row justify-evenly items-center rounded-lg px-2 py-4 ${isNight ? 'bg-[#1f2246]' : 'bg-white'}`}>
              <View className='flex-row items-center '>
                <TextInput
                  className={`
                    w-[114px] 
                    h-[105px] 
                    py-4 
                    px-4 
                    text-[64px] 
                    text-center 
                    rounded-lg 
                    ${isNight ? 'bg-[#1f2246] text-slate-100 focus:border-white' : 'focus:border border-[#8E97FD] text-slate-100'}
                    ${inputHours !== '' ? 'bg-[#232b81] border border-[#8E97FD]' : ''} 
                    ${inputHours === '' && isNight ? 'border bg-transparent border-[#8E97FD]' : ''}
                  `}
                  placeholder='00'
                  keyboardType='numeric'
                  maxLength={2}
                  placeholderTextColor={isNight ? 'gray' : '#D3D7FF'}
                  value={inputHours}
                  onChangeText={handleInputChangeHours}
                />
                <Text className={`text-5xl px-1 font-semibold text-slate-100 ${isNight ? 'text-slate-100' : 'text-slate-900'}`}>:</Text>
                <TextInput
                  className={`
                      w-[114px] 
                      h-[105px] 
                      py-4 
                      px-4 
                      text-[64px] 
                      text-center 
                      rounded-lg 
                      ${isNight ? 'bg-[#1f2246] text-slate-100 focus:border-white' : 'focus:border border-[#8E97FD] text-slate-100'} 
                      ${inputMinutes !== '' ? 'bg-blue-400 border border-[#8E97FD]' : ''}
                      ${inputMinutes === '' && isNight ? 'border bg-transparent border-[#8E97FD]' : ''}
                    `}
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
                markedDates={getMarkedDates()}
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
            
            <View className={`mt-5 flex flex-row justify-evenly items-center rounded-lg px-2 py-4 ${isNight ? 'bg-[#1f2246]' : 'bg-white'}`}>
                <View className='w-full flex flex-col justify-center'>
                  <View className='flex flex-row items-start ml-4'>
                    <Text className={`text-lg text-left ${isNight ? 'text-white' : 'text-black'}`}>Repeat</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className='flex flex-row justify-start'>
                      {repeat.map((repeatOption) => (
                        <View key={repeatOption.name} className='p-1'>
                          <TouchableOpacity
                            onPress={() => setSelectedRepeat(repeatOption.name)}
                            style={{
                              width: 80,
                              height: 45,
                              borderRadius: 8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: repeatOption.name === selectedRepeat ? '#8E97FD' : 'transparent',
                              borderWidth: 1,
                              borderColor: '#8E97FD',
                            }}
                          >
                            <Text style={{
                              fontSize: 16,
                              color: repeatOption.name === selectedRepeat ? 'white' : '#8E97FD',
                            }}>
                              {repeatOption.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                  
                </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={isNight ? 'light' : 'dark'} />
    </View>
  );
};