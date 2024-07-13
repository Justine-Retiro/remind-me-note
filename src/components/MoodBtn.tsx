import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

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
      <StyledText className="text-white text-2xl">
        {mood}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default MoodButton;