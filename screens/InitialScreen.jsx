import React, { useEffect } from 'react';
import { Image } from 'react-native'; // 1. Importar o componente Image
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { COLORS } from '../constants/Colors';
// 1. Importar os hooks de animação
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

// Utiliza Styled-Components para estilização
const StyledButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.secondary ? 'transparent' : COLORS.primary};
  border: ${props => props.secondary ? `2px solid ${props.borderColor || COLORS.primary}` : 'none'};
  padding: 14px 25px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 15px;
  min-width: 80%;
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor || (props.secondary ? COLORS.primary : COLORS.accent)};
  font-size: 18px;
  font-weight: bold;
`;

const CustomButton = ({ title, onPress, secondary = false, textColor, ...props }) => (
  <StyledButtonContainer onPress={onPress} activeOpacity={0.7} secondary={secondary} {...props} >
    <ButtonText secondary={secondary} textColor={textColor}>{title}</ButtonText>
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
  margin-bottom: 60px; /* 2. Adiciona um espaço entre o logo e os botões */
`;

const LogoImage = styled.Image`
  width: 300px; /* 1. Logo maior */
  height: 300px; /* 1. Logo maior */
  resize-mode: contain; /* Garante que a imagem se ajuste sem distorcer */
`;

const ButtonGroup = styled.View`
    width: 100%;
    align-items: center;
    /* O padding-bottom foi removido para centralizar o grupo */
`;

// 2. Criar componentes animados a partir dos seus styled-components
const AnimatedLogoArea = Animated.createAnimatedComponent(LogoArea);
const AnimatedButtonGroup = Animated.createAnimatedComponent(ButtonGroup);

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

    const navigateToLogin = () => {
      navigation.navigate('Login');
    }

    // 3. Definir os valores iniciais da animação
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const buttonsOpacity = useSharedValue(0);
    const buttonsTranslateY = useSharedValue(50); // Começa 50px para baixo

    // 4. Iniciar a animação quando a tela é montada
    useEffect(() => {
        // Animação do logo
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withTiming(1, { duration: 800 });

        // Animação dos botões, com um pequeno atraso
        buttonsOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
        buttonsTranslateY.value = withDelay(300, withTiming(0, { duration: 600 }));
    }, []);

    // 5. Criar os estilos animados que serão aplicados aos componentes
    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const buttonsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: buttonsOpacity.value,
        transform: [{ translateY: buttonsTranslateY.value }],
    }));

    return (
        <ScreenContainer>
            <AnimatedLogoArea style={logoAnimatedStyle}>
                <LogoImage 
                    source={require('../assets/Habitus_Logo.png')} 
                />
            </AnimatedLogoArea>

            <AnimatedButtonGroup style={buttonsAnimatedStyle}>
                <CustomButton 
                    title="Entrar" 
                    onPress={navigateToLogin} 
                />
                <CustomButton 
                    title="Criar Conta" 
                    onPress={navigateToRegister} 
                    secondary 
                />
            </AnimatedButtonGroup>
        </ScreenContainer>
    );
}
