import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);

const MoodButton = ({ mood, onPress, isSelected }) => {
  return (
    <StyledTouchableOpacity
      className={`
        w-14 h-14 rounded-full justify-center items-center mx-1
        ${isSelected 
          ? 'bg-transparent border-2 border-[#8E97FD]' 
          : 'bg-[#8E97FD]'
        }
      `}
      onPress={() => onPress(mood)}
    >
      <StyledView className="flex-1 justify-center items-center">
        <StyledText className="text-white text-center text-4xl mt-1">
          {mood}
        </StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default MoodButton;