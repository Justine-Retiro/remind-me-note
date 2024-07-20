import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';

interface CustomRepeatModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date | null, time: Date | null, repeatOption: string) => void;
}

const CustomRepeatModal: React.FC<CustomRepeatModalProps> = ({ visible, onClose, onSave }) => {
  const [isDateEnabled, setIsDateEnabled] = useState(true);
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [repeatOption, setRepeatOption] = useState('Never');

  const toggleDateSwitch = () => setIsDateEnabled(prev => !prev);
  const toggleTimeSwitch = () => setIsTimeEnabled(prev => !prev);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', paddingTop: 40 }}>
        <ScrollView>
          <View style={{ backgroundColor: '#1F2937', margin: 16, borderRadius: 8, padding: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: '#3B82F6', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>Details</Text>
              <TouchableOpacity onPress={() => onSave(
                isDateEnabled ? selectedDate : null,
                isTimeEnabled ? selectedTime : null,
                repeatOption
              )}>
                <Text style={{ color: '#3B82F6', fontSize: 18 }}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Date section */}
            <View style={{ backgroundColor: '#111827', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="calendar" size={24} color="#EF4444" />
                  <Text style={{ color: '#3B82F6', marginLeft: 8, fontSize: 16 }}>Date</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isDateEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDateSwitch}
                  value={isDateEnabled}
                />
              </View>
              {isDateEnabled && (
                <Calendar
                  current={selectedDate.toISOString()}
                  onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
                  markedDates={{
                    [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#3B82F6' }
                  }}
                  theme={{
                    backgroundColor: '#111827',
                    calendarBackground: '#111827',
                    textSectionTitleColor: '#6B7280',
                    selectedDayBackgroundColor: '#3B82F6',
                    selectedDayTextColor: '#FFFFFF',
                    todayTextColor: '#3B82F6',
                    dayTextColor: '#FFFFFF',
                    textDisabledColor: '#4B5563',
                    monthTextColor: '#FFFFFF',
                    arrowColor: '#3B82F6',
                  }}
                />
              )}
            </View>

            {/* Time section */}
            <View style={{ backgroundColor: '#111827', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="time" size={24} color="#3B82F6" />
                  <Text style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16 }}>Time</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isTimeEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleTimeSwitch}
                  value={isTimeEnabled}
                />
              </View>
              {isTimeEnabled && (
                <DatePicker
                  date={selectedTime}
                  onDateChange={setSelectedTime}
                  mode="time"
                  textColor="#FFFFFF"
                  fadeToColor="none"
                  style={{ backgroundColor: '#111827' }}
                />
              )}
            </View>

            {/* Early Reminder section */}
            <View style={{ backgroundColor: '#111827', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="notifications" size={24} color="#8B5CF6" />
                  <Text style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16 }}>Early Reminder</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', marginRight: 8 }}>None</Text>
                  <Icon name="chevron-forward" size={24} color="#6B7280" />
                </View>
              </View>
            </View>

            {/* Repeat section */}
            <View style={{ backgroundColor: '#111827', borderRadius: 8, padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="repeat" size={24} color="#10B981" />
                  <Text style={{ color: '#FFFFFF', marginLeft: 8, fontSize: 16 }}>Repeat</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', marginRight: 8 }}>{repeatOption}</Text>
                  <Icon name="chevron-forward" size={24} color="#6B7280" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CustomRepeatModal;