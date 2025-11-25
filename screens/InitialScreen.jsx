import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useTheme } from '../services/ThemeContext';

const StyledButtonContainer = styled.TouchableOpacity`
  background-color: ${props => props.secondary ? 'transparent' : props.theme.primary};
  border: ${props => props.secondary ? `2px solid ${props.borderColor || props.theme.primary}` : 'none'};
  padding: 14px 25px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 15px;
  min-width: 80%;
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor || (props.secondary ? props.theme.primary : props.theme.accent)};
  font-size: 18px;
  font-weight: bold;
`;

const CustomButton = ({ title, onPress, secondary = false, textColor, ...props }) => (
  <StyledButtonContainer onPress={onPress} activeOpacity={0.7} secondary={secondary} {...props} >
    <ButtonText secondary={secondary} textColor={textColor}>{title}</ButtonText>
  </StyledButtonContainer>
);

const ScreenContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;
const LogoArea = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
`;

const LogoImage = styled.Image`
  width: 300px;
  height: 300px;
  resize-mode: contain;
`;

const ButtonGroup = styled.View`
    width: 100%;
    align-items: center;
`;

const AnimatedLogoArea = Animated.createAnimatedComponent(LogoArea);
const AnimatedButtonGroup = Animated.createAnimatedComponent(ButtonGroup);

export default function InitialScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const navigateToApp = () => {
    navigation.navigate('AppContent');
  };

  const navigateToRegister = () => {
    navigation.navigate('Cadastro');
  }

  const navigateToLogin = () => {
    navigation.navigate('Login');
  }

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(50);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    buttonsOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(300, withTiming(0, { duration: 600 }));
  }, []);

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
