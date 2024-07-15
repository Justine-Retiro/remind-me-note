import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderBottom = ({ selectedDate, onDateSelect, onMonthChange }) => {
  const currentMonth = selectedDate.clone().startOf('month');
  const currentYear = selectedDate.year();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dates = [];
  let day = currentMonth.clone().startOf('month');
  while (day.month() === currentMonth.month()) {
    dates.push(day.clone());
    day.add(1, 'day');
  }

  const handlePrevMonth = () => {
    const prevMonth = currentMonth.clone().subtract(1, 'month');
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth.clone().add(1, 'month');
    onMonthChange(nextMonth);
  };

  const handleMonthYearSelect = (month, year) => {
    const selectedMonth = moment(`${year}-${month}`, 'YYYY-MM');
    onMonthChange(selectedMonth);
    setIsDropdownOpen(false);
  };

  const renderMonthYearDropdown = () => {
    const months = moment.months();
    const years = Array.from({ length: 5 }, (_, index) => currentYear + index);

    return (
      <View className="absolute top-10 right-0 bg-white border border-gray-300 rounded-lg shadow-lg">
        {months.map((month, index) => (
          <TouchableOpacity
            key={month}
            onPress={() => handleMonthYearSelect(index + 1, currentYear)}
            className="px-4 py-2 border-b border-gray-300"
          >
            <Text className="text-gray-800">{month}</Text>
          </TouchableOpacity>
        ))}
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() => handleMonthYearSelect(currentMonth.month() + 1, year)}
            className="px-4 py-2"
          >
            <Text className="text-gray-800">{year}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="w-full h-auto">
      <View className="mt-3 flex justify-between">
        <View className="flex flex-row justify-between">
          <View className="flex flex-row gap-2 items-end">
            <Text className="font-semibold text-start text-[20px] text-slate-800">
              Reminders List
            </Text>
            <Text className="text-start font-regular text-[16px] text-slate-400">
              on this month
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <View className="flex flex-row items-center">
              <Text className="font-semibold text-start text-[16px] text-slate-600">
                {currentMonth.format('YYYY MMMM')}
              </Text>
              <Icon name="keyboard-arrow-down" size={20} color="black" />
            </View>
          </TouchableOpacity>
          {isDropdownOpen && renderMonthYearDropdown()}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row justify-between mt-4 overflow-x-scroll">
          {dates.map((date) => (
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
    </View>
  );
};

export default HeaderBottom;