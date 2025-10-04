import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; // Importação compatível com Expo Go

// --- 1. DEFINIÇÕES DE COR E ESTILO ---
const COLORS = {
    primary: '#4CAF50', 
    background: '#1E1E1E', 
    textLight: '#E0E0E0', 
    accent: '#FFB300',
    disabled: '#A5D6A7',
};

// --- 2. COMPONENTE BUTTON REUTILIZÁVEL (SIMULADO) ---
// Utiliza Styled-Components para estilização
const StyledButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.secondary ? 'transparent' : COLORS.primary};
  border: ${props => props.secondary ? `2px solid ${COLORS.primary}` : 'none'};
  padding: 14px 25px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 15px;
  min-width: 80%;
`;

const ButtonText = styled.Text`
  color: ${props => props.secondary ? COLORS.primary : COLORS.textLight};
  font-size: 18px;
  font-weight: bold;
`;

const CustomButton = ({ title, onPress, secondary = false, ...props }) => (
  <StyledButtonContainer onPress={onPress} activeOpacity={0.7} secondary={secondary} {...props}>
    <ButtonText secondary={secondary}>{title}</ButtonText>
  </StyledButtonContainer>
);

// --- 3. ESTILIZAÇÃO DA TELA INICIAL ---
const ScreenContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.background};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LogoArea = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const AppTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${COLORS.textLight};
  margin-top: 10px;
`;

const Tagline = styled.Text`
  font-size: 16px;
  color: ${COLORS.accent};
  margin-bottom: 30px;
  text-align: center;
`;

const ButtonGroup = styled.View`
    width: 100%;
    align-items: center;
`;

// --- 4. O COMPONENTE DE TELA ---
export default function InitialScreen() {
    const navigation = useNavigation();

    // Função de navegação temporária
    const navigateToApp = () => {
        // NOTE: Em um app real, você navegaria para um Stack ou Tab Navigator principal.
        // Assumindo que sua tela de receitas é 'Receitas' (que é a tela dentro do ReceitasStack)
        navigation.navigate('AppContent');
    };

    const navigateToRegister = () => {
      navigation.navigate('Cadastro');
    }

    return (
        <ScreenContainer>
            <LogoArea>
                {/* Ícone do Logo */}
                <Ionicons 
                    name="nutrition-outline" 
                    size={80} 
                    color={COLORS.primary} 
                />
                <AppTitle>Habitus</AppTitle>
                <Tagline>Seu Guia de Receitas Saudáveis e Metas Calóricas</Tagline>
            </LogoArea>

            <ButtonGroup>
                {/* Botão Principal: Entrar (Navega para a tela de receitas temporariamente) */}
                <CustomButton 
                    title="Entrar" 
                    onPress={navigateToApp} 
                />

                {/* Botão Secundário: Criar Conta (Navega para a tela de receitas temporariamente) */}
                <CustomButton 
                    title="Criar Conta" 
                    onPress={navigateToRegister} 
                    secondary 
                />
            </ButtonGroup>
        </ScreenContainer>
    );
}
