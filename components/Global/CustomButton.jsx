import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../services/ThemeContext';

const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.secondary ? 'transparent' : (props.backgroundColor || props.theme.primary)};
  border: ${(props) => props.secondary ? `2px solid ${props.borderColor || props.theme.primary}` : 'none'};
  margin-top: 10px;
  opacity: ${(props) => props.disabled ? 0.6 : 1};
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.textColor || (props.secondary ? props.theme.primary : props.theme.background)};
  ${(props) => props.secondary && props.theme.primaryTextShadow && `
    text-shadow-color: ${props.theme.primaryTextShadow.textShadowColor};
    text-shadow-offset: ${props.theme.primaryTextShadow.textShadowOffset.width}px ${props.theme.primaryTextShadow.textShadowOffset.height}px;
    text-shadow-radius: ${props.theme.primaryTextShadow.textShadowRadius}px;
  `}
`;

const CustomButton = ({ title, onPress, secondary, backgroundColor, textColor, borderColor, disabled, style, textStyle }) => {
  const { theme } = useTheme(); // Access theme to pass explicitly if needed, though styled-components handles it via context

  return (
    <ButtonContainer
      onPress={onPress}
      secondary={secondary}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      disabled={disabled}
      style={style}
    >
      <ButtonText secondary={secondary} textColor={textColor} style={textStyle}>
        {title}
      </ButtonText>
    </ButtonContainer>
  );
};

export default CustomButton;