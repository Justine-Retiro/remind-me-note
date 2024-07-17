import * as FileSystem from 'expo-file-system';

const FILE_NAME = 'userData.json';
const FILE_PATH = FileSystem.documentDirectory + FILE_NAME;

export const saveUserData = async (data) => {
  try {
    const dataToSave = {
      ...data,
      moodTimestamp: data.mood ? Date.now() : null,
    };
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(dataToSave));
    console.log('Data saved successfully', dataToSave);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadUserData = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
    if (!fileInfo.exists) {
      console.log('No user data file exists');
      return null;
    }
    const content = await FileSystem.readAsStringAsync(FILE_PATH);
    const data = JSON.parse(content);
    
    // Check if mood is older than 24 hours
    if (data.moodTimestamp) {
      const now = Date.now();
      const moodAge = now - data.moodTimestamp;
      if (moodAge > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
        data.mood = null;
        data.moodTimestamp = null;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};