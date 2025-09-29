import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.TouchableOpacity`
  background-color: ${props => props.disabled ? "#A5D6A7" : "#4CAF50"};
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Button = ({ title, onPress, disabled = false, style }) => {
  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
      disabled={disabled}
    >
      <ButtonText>{title}</ButtonText>
    </Container>
  )
}

export default Button;