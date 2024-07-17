import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styled } from 'nativewind';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const ButtonSort = ({ filter, icon, onPress, isSelected }) => {
  return (
    <StyledTouchableOpacity
      className={`
        px-4 py-2 w-[48%] rounded-xl justify-center items-start bg-transparent border-2  border-[#8E97FD]
        ${isSelected ? 'bg-[#8E97FD]' : 'bg-transparent border-2 border-[#8E97FD]'}
      `}
      onPress={onPress}
    >
      <View className='flex flex-row items-center'>
        <View className={`
          bg-[#B2B9FF] p-1 rounded-full 
          ${isSelected ? 'bg-[#B2B9FF]' : 'bg-transparent'}
        `}>
          <Icon 
            name={icon} 
            size={24}
            color={isSelected ? 'white' : '#8E97FD'}
          />
        </View>
        
        <StyledText 
          className={`
            ml-2
            text-lg
            ${isSelected ? 'text-white' : 'text-[#8E97FD]'}
          `}
        >
          {filter}
        </StyledText>
      </View>
    </StyledTouchableOpacity>
  );
};

export default ButtonSort;