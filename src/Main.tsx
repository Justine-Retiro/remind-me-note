import { View, Text, Image, ScrollView, RefreshControl, AppState } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { saveUserData, loadUserData, updateReminderStatus, repeatReminderDaily, deleteReminder } from './utils/userDataManager'; // Added deleteReminder import
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import Greeting from './components/Greeting';
import Dashboard from './components/Dashboard';
import ButtonSort from './components/ButtonSort';
import { useNavigation } from '@react-navigation/native';
import HeaderBottom from './components/HeaderBottom';
import moment from 'moment';
import NoteCards from './components/NoteCards';
import ReminderTabs from './components/ReminderTabs';
import { Button } from './components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomRepeatModal from './components/CustomRepeatModal';

export const Main = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userData, setUserData] = useState({ userName: '', mood: '', reminders: [] });
  const [greeting, setGreeting] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Notes');
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dates, setDates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reminder, setReminder] = useState({ title: '', time: '' });
  const [eventsToday, setEventsToday] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0); 
  const [selectedReminders, setSelectedReminders] = useState({});
  const selectionTimers = useRef({});
  const appState = useRef(AppState.currentState);
  const [showCustomRepeatModal, setShowCustomRepeatModal] = useState(false);
  const [currentReminderId, setCurrentReminderId] = useState<string | null>(null);

  const filters = [
    { name: 'Notes', icon: 'notes' },
    { name: 'Reminder', icon: 'radio-button-on' }
  ];

  useEffect(() => {

    async function prepare() {
      try {
        // Load user data
        const storedData = await loadUserData();
        if (storedData) {
          setUserData(storedData);
          setReminder(storedData.reminder);
          loadStoredData();
        }
        // Set greeting
        setGreeting(getGreeting());
      } catch (error) {
        console.error('Error in prepare function:', error);
      }
    }

    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const daysInMonth = [];
    let day = startOfMonth;

    while (day <= endOfMonth) {
      daysInMonth.push(day.clone());
      day = day.clone().add(1, 'd');
    }
    setDates(daysInMonth);

    prepare();

    return () => {
      Object.values(selectionTimers.current).forEach(clearTimeout);
    };
  }, [loadStoredData]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStoredData();
    setRefreshing(false);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (month) => {
    setSelectedDate(month);
  };

  const handleAddNavigation = () => {
    if(selectedFilter === 'Notes') {
      navigation.navigate('NoteAdd');
    } else {
      navigation.navigate('ReminderAdd');
    }
  } 

  const handleReminderSelect = useCallback((id) => {
    setSelectedReminders((prev) => {
      const newState = { ...prev };
      if (newState[id]) {
        clearTimeout(selectionTimers.current[id]);
        delete newState[id];
        delete selectionTimers.current[id];
      } else {
        newState[id] = true;
        selectionTimers.current[id] = setTimeout(async () => {
          try {
            await updateReminderStatus(id, 'done');
            setUserData(prevUserData => {
              const updatedReminders = prevUserData.reminders.map(reminder => 
                reminder.id === id ? { ...reminder, status: 'done' } : reminder
              );
              return { ...prevUserData, reminders: updatedReminders };
            });
            setSelectedReminders(prev => {
              const newState = { ...prev };
              delete newState[id];
              return newState;
            });
            await loadStoredData(); // Reload data to reflect changes
          } catch (error) {
            console.error('Error updating reminder status:', error);
          }
        }, 1000);
      }
      console.log('Updated selected reminders:', newState);
      return newState;
    });
  }, [loadStoredData]);

  const loadStoredData = async () => {
    try {
      const storedData = await loadUserData();
      console.log('Loaded stored data:', JSON.stringify(storedData));
      if (storedData) {
        setUserData(storedData);
        setGreeting(getGreeting());

        const todayStart = moment().startOf('day');
        const todayEnd = moment().endOf('day');

        const currentRemindersForToday = storedData.reminders.filter(reminder => 
          moment(reminder.dateTime).isBetween(todayStart, todayEnd, null, '[]') && reminder.status === 'pending'
        ).length;
        setEventsToday(currentRemindersForToday);

        const completedReminders = storedData.reminders ? storedData.reminders.filter(reminder => reminder.status === 'done').length || 0 : 0;
        setCompletedTasks(completedReminders);

        const pendingReminders = storedData.reminders.filter(reminder => reminder.status === 'pending').length;
        setPendingTasks(pendingReminders);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const handleRepeatReminder = useCallback((id: string, frequency: 'daily' | 'custom') => {
    if (frequency === 'daily') {
      repeatReminderDaily(id);
      loadStoredData(); // Reload data to reflect changes
    } else {
      setCurrentReminderId(id);
      setShowCustomRepeatModal(true);
    }
  }, [loadStoredData]);

  const handleCustomRepeatSave = (startDate: Date, endDate: Date | null) => {
    console.log('Custom repeat set for:', startDate, 'to', endDate);
    // Implement your logic to update the reminder with the new repeat dates
    setShowCustomRepeatModal(false);
  };

  const handleDeleteReminder = useCallback(async (id: string) => {
    try {
      await deleteReminder(id);
      await loadStoredData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  }, [loadStoredData]);

  const noteCount = userData.notes ? userData.notes.length : 0; 
  const reminderCount = userData.reminders ? userData.reminders.length : 0;

  return (
    <View className={`w-screen h-screen ${new Date().getHours() >= 18 ? 'bg-[#03174C]' : 'bg-white'}`}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 items-center px-3 ">
          {/* BG */}
          <View className="mt-16">
            <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
              <Image
                className={`w-screen ${new Date().getHours() >= 18 ? 'top-24 -z-10' : '-bottom-full'}`}
                source={new Date().getHours() >= 18 ? require('../assets/night-cloud.png') : require('../assets/bg2.png')}
                resizeMode="cover"
              />
            </View>
            <View className='absolute bottom-0 left-0 right-0 z-10 items-center'>
              <Image
                className={`w-screen ${new Date().getHours() >= 18 ? 'top-24' : 'hidden'}`}
                source={require('../assets/moon.png')}
                resizeMode="contain"
              />
            </View>
          </View>
          {/* Dashboard */}
          <Greeting userData={userData} greeting={greeting} />
          <Dashboard eventsToday={eventsToday} completedTasks={completedTasks} pendingTasks={pendingTasks} />
          <View className="flex flex-row mt-6 w-full justify-between">
            {filters.map((filter) => (
              <ButtonSort
                key={filter.name}
                filter={filter.name}
                icon={filter.icon}
                isSelected={selectedFilter === filter.name}
                onPress={() => setSelectedFilter(filter.name)}
              />
            ))}
          </View>
          {selectedFilter === 'Reminder' && (
            <HeaderBottom
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              reminders={userData.reminders} 
            />
          )}

          {selectedFilter === 'Notes' && 
          //  {userData.reminders
          <NoteCards />}
          
          {selectedFilter === 'Reminder' && 
            <View className='h-full w-full mt-3 rounded-lg'>
              <ScrollView>
                {userData.reminders
                  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                  .map((reminder) => (
                    <ReminderTabs 
                      key={reminder.id}
                      id={reminder.id}
                      title={reminder.title}
                      desc={reminder.description}
                      time={reminder.dateTime}
                      onSelect={handleReminderSelect}
                      isSelected={!!selectedReminders[reminder.id]}
                      status={reminder.status}
                      onRepeat={handleRepeatReminder}
                      onDelete={handleDeleteReminder}
                    />
                  ))}
                </ScrollView>
            </View>
          }
        </View>
        <StatusBar style={new Date().getHours() >= 18 ? 'light' : 'dark'} />
      </ScrollView>
        <View className="absolute bottom-8 left-4 right-4">
          <BlurView
            intensity={80}
            tint="default"
            className="overflow-hidden rounded-xl border border-white/20"
          >
            <View className="flex-row items-center justify-between px-3 py-3">
              <View className="flex-row items-center">
                {/* <Icon name={selectedFilter === 'Notes' ? 'note-text' : 'bell'} size={20} color="#FFFFFF" /> */}
                <Text className="text-white ml-2 text-lg">{selectedFilter === 'Notes' ? noteCount : reminderCount} {selectedFilter === 'Notes' ? 'Notes' : 'Reminders'}</Text>
              </View>
              <Button 
                icon="add-circle" 
                onPress={handleAddNavigation}
                text={selectedFilter === 'Notes' ? 'Add Note' : 'Add Reminder'}
              />
            </View>
          </BlurView>
        </View>
        <CustomRepeatModal
          visible={showCustomRepeatModal}
          onClose={() => setShowCustomRepeatModal(false)}
          onSave={handleCustomRepeatSave}
        />
    </View>
  );
};