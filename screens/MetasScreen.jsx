import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import MetasList from '../components/Metas/MetasList';
import { COLORS } from '../constants/Colors';

// Reutilizando o mesmo estilo de botão da tela inicial para consistência
const StyledButtonContainer = styled.TouchableOpacity`
  background-color: ${COLORS.primary};
  padding: 14px 25px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${COLORS.accent};
  font-size: 18px;
  font-weight: bold;
`;

const MetasScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  
  useEffect(() => {
    if (isFocused) setRefreshTrigger(prev => !prev);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <StyledButtonContainer onPress={() => navigation.navigate('MetaForm')} activeOpacity={0.7}>
          <ButtonText>Adicionar Meta</ButtonText>
        </StyledButtonContainer>
      </View>
      <MetasList refreshTrigger={refreshTrigger} />
    </View>
  );
};

// Utilizando um objeto de estilo simples, já que styled-components não é necessário aqui
const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
};

export default MetasScreen;
