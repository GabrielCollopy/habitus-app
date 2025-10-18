import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import CustomButton from '../components/Global/CustomButton';
import { createUser } from '../services/UserService';
import { login } from '../services/AuthService';
import { COLORS } from '../constants/Colors';


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
    const navigation = useNavigation();
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
            navigation.reset({
                index: 0,
                routes: [{ name: 'AppContent' }],
            });
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha inválidos.');
        } finally {
            setLoading(false);
        }
        setLoading(false);
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

                    <CustomButton
                        title={loading ? "Fazendo Login..." : "Entrar"}
                        onPress={handleSubmit}
                        disabled={loading}
                        style={{ marginTop: 20 }}
                    />
                </FormWrapper>
            </KeyboardAwareScrollView>
        </ScreenContainer>
    );
};

export default LoginScreen;