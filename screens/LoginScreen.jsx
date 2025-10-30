import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import { COLORS } from '../constants/Colors';
import { useAuth } from '../services/AuthContext';

// Botão estilizado para ser consistente com o resto do app
const StyledButton = styled.TouchableOpacity`
    background-color: ${props => props.disabled ? COLORS.textSecondary : COLORS.primary};
    padding: 14px 25px;
    border-radius: 10px;
    align-items: center;
    margin-top: 20px;
`;

const ButtonText = styled.Text`
    color: ${COLORS.accent};
    font-size: 18px;
    font-weight: bold;
`;

const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${COLORS.background};
    padding: 24px;
`;

const FormWrapper = styled.View`
    padding: 20px;
    background-color: ${COLORS.cardBackground};
    border-radius: 12px;
    margin-top: 50px;
`;

const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${COLORS.textLight};
    margin-bottom: 20px;
    text-align: center;
`;

const Subtitle = styled.Text`
    color: ${COLORS.textLight};
    text-align: center;
    margin-bottom: 20px;
`;

const LoginScreen = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
            // Não é mais necessário navegar! O AppNavigator fará a troca de tela automaticamente.
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
                        secureTextEntry
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