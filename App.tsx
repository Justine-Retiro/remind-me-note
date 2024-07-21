import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash } from './src/Splash';
import { Boot } from './src/Boot';
import { Main } from './src/Main';
import { loadUserData, registerForPushNotificationsAsync, setupNotifications } from './src/utils/userDataManager';
import { ReminderAdd } from './src/ReminderAdd';
import { NoteAdd } from './src/NoteAdd';
import { NoteDetail } from './src/NoteDetail';
import * as Notifications from 'expo-notifications';
// import { ReminderAddDetails } from './src/ReminderAddDetails';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'SF-Pro-Text-Semibold' : require('./assets/fonts/SF-Pro-Text-Semibold.otf'),
          'SF-Pro-Display-Medium': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
          'SF-Pro-Display-Bold': require('./assets/fonts/SF-Pro-Display-Bold.otf'),
          'SF-Pro-Display-Regular': require('./assets/fonts/SF-Pro-Display-Regular.otf'),
        });

        // Check for existing user data
        const userData = await loadUserData();
        console.log('Loaded user data:', userData);

        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const userDataMoodTimestamp = userData?.moodTimestamp;

        if (userData && userData.firstTime) {
          if ((userDataMoodTimestamp && Date.now() - userDataMoodTimestamp > twentyFourHours) || userDataMoodTimestamp === null) {
            console.log('Mood expired, redirecting to Boot');
            setInitialRoute('Boot');
          } else {
            console.log('Mood not expired, redirecting to Main');
            setInitialRoute('Main');
          }
        } else {
          console.log('No user data, redirecting to Splash');
          setInitialRoute('Splash');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }
    setupNotifications();
    prepare();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      // Handle received notification
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      // Handle notification response (e.g., when user taps on the notification)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  if (!fontsLoaded || initialRoute === null) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Boot" component={Boot} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="ReminderAdd" component={ReminderAdd} />
        <Stack.Screen name="NoteAdd" component={NoteAdd} />
        <Stack.Screen name="NoteDetail" component={NoteDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}