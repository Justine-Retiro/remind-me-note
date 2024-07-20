import { View, Text, TouchableOpacity, ScrollView, Platform, Appearance } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const HeaderBottom = ({ selectedDate, onDateSelect, onMonthChange, reminders }) => {
  const currentMonth = selectedDate.clone().startOf('month');
  const currentYear = selectedDate.year();
  const currentHour = new Date().getHours();
  const displayMode = currentHour >= 18 ? 'dark' : (Appearance.getColorScheme() === 'dark' ? 'dark' : 'default');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dates = [];
  let day = currentMonth.clone().startOf('month');
  while (day.month() === currentMonth.month()) {
    dates.push(day.clone());
    day.add(1, 'day');
  }

  // Filter dates to include only those that have tasks
  const datesWithTasks = dates.filter(date => 
    reminders.some(reminder => moment(reminder.dateTime).isSame(date, 'day'))
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    onMonthChange(moment(date));
    hideDatePicker();
  };

  return (
    <View className="w-full h-auto">
      <View className="mt-3 flex justify-between">
        <View className="flex flex-row justify-between">
          <View className="flex flex-row gap-2 items-end">
            <Text className={`font-semibold text-start text-[20px] ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-800'}`}>
              Reminders List
            </Text>
            <Text className={`text-start font-regular text-[16px] ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-400'}`}>
              on this month
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={showDatePicker}>
            <View className="flex flex-row items-center">
              <Text className={`font-semibold text-start text-[16px] ${new Date().getHours() >= 18 ? 'text-white' : 'text-slate-600'}`}>
                {currentMonth.format('MMMM YYYY')}
              </Text>
              <Icon name="keyboard-arrow-down" size={20} color={new Date().getHours() >= 18 ? 'gray' : 'black'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row justify-between mt-4 overflow-x-scroll">
          {datesWithTasks.map((date) => (
            <TouchableOpacity
              key={date.format('YYYY-MM-DD')}
              onPress={() => onDateSelect(date)}
              className={`flex items-center justify-center px-3 py-2 mr-2 ${
                date.isSame(selectedDate, 'day')
                  ? 'bg-blue-500 rounded-lg'
                  : 'bg-transparent border-2 border-blue-400 rounded-lg'
              }`}
            >
              <Text
                className={`text-xs ${
                  date.isSame(selectedDate, 'day') ? 'text-white' : 'text-[#8E97FD]'
                }`}
              >
                {date.format('ddd')}
              </Text>
              <Text
                className={`text-lg font-bold text-[#8E97FD] ${
                  date.isSame(selectedDate, 'day') ? 'text-white' : 'text-[#8E97FD]'
                }`}
              >
                {date.format('DD')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display={Platform.OS === 'ios' ? 'inline' : displayMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate.toDate()}
        maximumDate={moment().add(5, 'years').toDate()}
        minimumDate={moment().toDate()}
        textColor={displayMode === 'dark' ? 'white' : 'black'}
        themeVariant={{}}
        cancelTextIOS="Cancel"
        confirmTextIOS="Confirm"
        headerTextIOS="Select Date"
        locale="en_US"
      />
    </View>
  );
};

export default HeaderBottom;