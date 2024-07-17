import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const MoodDisplay = ({ mood, onPress, isSelected }) => {
  return (
    <StyledTouchableOpacity
      className={`
        w-14 h-14 rounded-full justify-center items-center
      `}
      onPress={() => onPress(mood)}
    >
      <StyledText className="text-white text-center text-4xl mt-1 ml-[2px]">
        {mood}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default MoodDisplay;