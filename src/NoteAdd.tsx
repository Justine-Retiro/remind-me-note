import { View, Text, TextInput, ScrollView, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import HeadingAdd from './components/HeadingAdd';
import { BlurView } from 'expo-blur';
import { saveUserData, loadUserData } from './utils/userDataManager';

export const NoteAdd = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTitleSet, setIsTitleSet] = useState(false);
  const isNight = new Date().getHours() >= 18;
  const noteInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const handleTextChange = (text: string) => {
    setTitle(text || '');
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text === '' && isTitleSet) {
      setIsTitleSet(false);
      titleInputRef.current.focus();
    }
  };

  const handleTitleSubmit = () => {
    if (!isTitleSet) {
      setIsTitleSet(true);
      noteInputRef.current.focus();
    }
  };

  const handleSaveNote = async () => {
    try {
      const userData = await loadUserData();
      if (!userData) {
        throw new Error('Failed to load user data');
      }

      const newNote = {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date().toISOString(),
      };

      const updatedUserData = {
        ...userData,
        notes: [...(userData.notes || []), newNote],
      };

      await saveUserData(updatedUserData);
      console.log('Note saved successfully', newNote);
      
      // Navigate back or to a different screen after saving
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
      // Handle error (e.g., show an error message to the user)
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
              title='New Note'
              onSave={handleSaveNote}
            />
          </View>
        </BlurView>
      </View>
      <ScrollView>
        <View className="flex-1 items-center px-3">
          <View className='w-full h-full mb-20'>
            <View className=''>
              <TextInput
                className={`w-full h-[45px] py-1 px-1 font-bold text-[25px] 
                ${isNight ? 'text-white border-[#2b1ea5] focus:border-blue-600' 
                : 'text-black  border-b border-slate-100 focus:border-slate-700'}`}
                placeholder='Title'
                placeholderTextColor={isNight ? '#D3D7FF' : 'gray'}
                value={title}
                onChangeText={handleTextChange}
                onSubmitEditing={handleTitleSubmit}
                ref={titleInputRef}
              />
            </View>
            <View className='mb-5 h-screen'>
              <TextInput
                className={`w-full h-full p-2 font-regular text-[15px] rounded-lg 
                ${isNight ? 'text-white border-[#2b1ea5] focus:border-blue-600' : 
                'text-black border border-slate-100 focus:border-slate-700'}`}
                placeholder='Note'
                placeholderTextColor={isNight ? '#D3D7FF' : 'gray'}
                value={description}
                multiline={true}
                numberOfLines={4}
                onChangeText={handleDescriptionChange}
                ref={noteInputRef}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style={isNight ? 'light' : 'dark'} />
    </View>
  );
};