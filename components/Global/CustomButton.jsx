import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from '../../constants/Colors';

const Container = styled.TouchableOpacity`
  background-color: ${(props) => {
    if (props.disabled) return '#A9A9A9';
    if (props.secondary) return 'transparent';
    return '#76F7BF';
  }};
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  margin-bottom: 10px;
  border: ${(props) => props.secondary ? `2px solid ${props.borderColor || COLORS.primary}` : 'none'};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.textColor || (props.secondary ? COLORS.primary : 'white')};
  font-size: 16px;
  font-weight: bold;
`;

const Button = ({ title, onPress, disabled = false, style, secondary = false, textColor, borderColor, ...props }) => {
  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
      disabled={disabled}
      secondary={secondary}
      borderColor={borderColor}
      {...props}
    >
      <ButtonText secondary={secondary} textColor={textColor}>{title}</ButtonText>
    </Container>
  )
}

export default Button;