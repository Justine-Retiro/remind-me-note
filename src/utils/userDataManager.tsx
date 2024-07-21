import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { parseISO, addDays, addWeeks, addMonths, addYears } from 'date-fns';

const FILE_NAME = 'userData.json';
const FILE_PATH = FileSystem.documentDirectory + FILE_NAME;
const REMINDER_TASK = 'REMINDER_TASK';
const EXPO_PROJECT_ID = '9c7fb7e7-ad14-4453-ab6e-f5421a709cbf';

interface Reminder {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  frequency: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  repeatDays: number[];
  repeatTime: string;
  status: 'pending' | 'done';
}

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  mood?: string;
  moodTimestamp?: number;
  userName?: string;
  reminders: Reminder[];
  notes: Note[];
}

// -----------------
// User Data
export const saveUserData = async (data: UserData) => {
  try {
    const dataToSave = {
      ...data,
      moodTimestamp: data.mood ? Date.now() : null,
      reminders: data.reminders || [],
      notes: data.notes || [], // Ensure notes is always an array
    };
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(dataToSave));
    console.log('Data saved successfully', dataToSave);
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const loadUserData = async (): Promise<UserData | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
    if (!fileInfo.exists) {
      console.log('No user data file exists');
      return { reminders: [], notes: [] }; // Initialize both reminders and notes
    }
    const content = await FileSystem.readAsStringAsync(FILE_PATH);
    const data: UserData = JSON.parse(content);
    
    // Check if mood is older than 24 hours
    if (data.moodTimestamp) {
      const now = Date.now();
      const moodAge = now - data.moodTimestamp;
      if (moodAge > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
        data.mood = undefined;
        data.moodTimestamp = undefined;
      }
    }
    
    // Ensure reminders and notes arrays exist
    if (!data.reminders) {
      data.reminders = [];
    }
    if (!data.notes) {
      data.notes = [];
    }
    
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

// -----------------
// Reminder
export const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
  try {
    const userData = await loadUserData();
    if (!userData) {
      throw new Error('Failed to load user data');
    }
    
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    
    userData.reminders.push(newReminder);
    await saveUserData(userData);
    
    // Schedule notification for the reminder
    await scheduleNotification(newReminder);
    
    console.log('Reminder added successfully', newReminder);
    return newReminder;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

export const updateReminderStatus = async (id: string, status: 'pending' | 'done') => {
  try {
    const userData = await loadUserData();
    if (userData) {
      const updatedReminders = userData.reminders.map(reminder => {
        if (reminder.id === id) {
          if (status === 'done' && reminder.frequency !== 'None') {
            // Calculate the next occurrence based on the frequency
            const currentDateTime = parseISO(reminder.dateTime);
            let nextDateTime;
            switch (reminder.frequency) {
              case 'Daily':
                nextDateTime = addDays(currentDateTime, 1);
                break;
              case 'Weekly':
                nextDateTime = addWeeks(currentDateTime, 1);
                break;
              case 'Monthly':
                nextDateTime = addMonths(currentDateTime, 1);
                break;
              case 'Yearly':
                nextDateTime = addYears(currentDateTime, 1);
                break;
              default:
                nextDateTime = currentDateTime;
            }
            reminder.dateTime = nextDateTime.toISOString();
            reminder.status = 'pending';
            // Reschedule the notification
            scheduleNotification(reminder);
          } else {
            reminder.status = status;
          }
        }
        return reminder;
      });
      const updatedUserData = { ...userData, reminders: updatedReminders };
      await saveUserData(updatedUserData);
      console.log(`Reminder ${id} status updated to ${status}`);
    }
  } catch (error) {
    console.error('Error updating reminder status:', error);
  }
};

export const deleteReminder = async (id: string) => {
  try {
    const userData = await loadUserData();
    if (userData) {
      const updatedReminders = userData.reminders.filter(reminder => reminder.id !== id);
      const updatedUserData = { ...userData, reminders: updatedReminders };
      await saveUserData(updatedUserData);
      console.log(`Reminder ${id} deleted successfully`);
    }
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// -----------------
// Reminder Notification Handler
async function scheduleNotification(reminder: Reminder) {
  const trigger = new Date(reminder.dateTime);
  let repeatInterval;

  switch (reminder.frequency) {
    case 'Daily':
      repeatInterval = 'day';
      break;
    case 'Weekly':
      repeatInterval = 'week';
      break;
    case 'Monthly':
      repeatInterval = 'month';
      break;
    case 'Yearly':
      repeatInterval = 'year';
      break;
    default:
      repeatInterval = null;
  }

  const triggerConfig = repeatInterval
    ? { repeats: true, hour: trigger.getHours(), minute: trigger.getMinutes(), interval: repeatInterval }
    : { date: trigger };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: reminder.title,
      data: { reminderId: reminder.id },
    },
    trigger: triggerConfig,
    identifier: reminder.id,
  });
  console.log('Notification scheduled');
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing notification permission status:', existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('New notification permission status:', finalStatus);
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      console.log('Notification permission not granted');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: EXPO_PROJECT_ID })).data;
    console.log('Push notification token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
    console.log('Not a physical device');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function setupNotifications() {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  TaskManager.defineTask(REMINDER_TASK, async ({ data, error }) => {
    if (error) {
      console.error("Task error:", error);
      return;
    }
    if (data) {
      const { reminderId } = data as { reminderId: string };
      await updateReminderStatus(reminderId, 'done');
    }
  });

  Notifications.addNotificationResponseReceivedListener(async (response) => {
    const reminderId = response.notification.request.content.data.reminderId as string;
    await TaskManager.isTaskRegisteredAsync(REMINDER_TASK) || 
      await TaskManager.registerTaskAsync(REMINDER_TASK, {
        data: { reminderId },
        taskName: REMINDER_TASK,
      });
  });
}
// -----------------
