import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import MetasList from '../components/Metas/MetasList';
import { useTheme } from '../services/ThemeContext';

const StyledButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.theme.primary};
  padding: 14px 25px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.accent};
  font-size: 18px;
  font-weight: bold;
`;

const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${props => props.theme.background};
`;

const ButtonWrapper = styled.View`
    padding: 16px;
    background-color: ${props => props.theme.background};
`;

const MetasScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (isFocused) setRefreshTrigger(prev => !prev);
  }, [isFocused]);

  return (
    <ScreenContainer>
      <ButtonWrapper>
        <StyledButtonContainer onPress={() => navigation.navigate('MetaForm')} activeOpacity={0.7}>
          <ButtonText>Adicionar Meta</ButtonText>
        </StyledButtonContainer>
      </ButtonWrapper>
      <MetasList refreshTrigger={refreshTrigger} />
    </ScreenContainer>
  );
};

export default MetasScreen;
