import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { useTheme } from '../services/ThemeContext';

// Botão estilizado para ser consistente com o resto do app
const StyledButton = styled.TouchableOpacity`
    background-color: ${props => props.disabled ? props.theme.textSecondary : props.theme.primary};
    padding: 14px 25px;
    border-radius: 10px;
    align-items: center;
    margin-top: 20px;
`;

const ButtonText = styled.Text`
    color: ${props => props.theme.accent};
    font-size: 18px;
    font-weight: bold;
`;

const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${props => props.theme.background};
    padding: 24px;
`;

const FormWrapper = styled.View`
    padding: 20px;
    background-color: ${props => props.theme.cardBackground};
    border-radius: 12px;
    margin-top: 50px;
`;

const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${props => props.theme.textLight};
    margin-bottom: 20px;
    text-align: center;
`;

const Subtitle = styled.Text`
    color: ${props => props.theme.textLight};
    text-align: center;
    margin-bottom: 20px;
`;

const LoginScreen = () => {
    const { login } = useAuth();
    const { colors } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScreenContainer>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
            >
                <FormWrapper>
                    <Title>Faça Seu Login</Title>

                    <CustomTextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Insira seu username"
                        autoCapitalize="none"
                    />

                    <CustomTextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Insira sua senha"
                        secureTextEntry={!isPasswordVisible}
                        icon={
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{ padding: 10 }}>
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <StyledButton onPress={handleSubmit} disabled={loading} activeOpacity={0.7}>
                        <ButtonText>{loading ? "Fazendo Login..." : "Entrar"}</ButtonText>
                    </StyledButton>
                </FormWrapper>
            </KeyboardAwareScrollView>
        </ScreenContainer>
    );
};

export default LoginScreen;