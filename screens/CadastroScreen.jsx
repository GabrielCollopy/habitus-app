import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import CustomButton from '../components/Global/CustomButton';
import { createUser } from '../services/UserService';
import { COLORS } from '../constants/Colors';
import { useAuth } from '../services/AuthContext';

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

const CadastroScreen = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }
        if(!username || !email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true);
        try {
            await createUser({ username, email, password, confirmPassword});
            // Após o cadastro, faz o login automático do usuário
            await login(username, password);
        } catch (error) {
            const errorMessage = error.errorMessage
            Alert.alert('Erro', errorMessage);
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
                    <Title>Criar Conta</Title>
                    <Subtitle>Comece sua jornada de nutrição e metas!</Subtitle>

                    <CustomTextInput
                        label="Nome de Usuário"
                        value={username}
                        onChangeText={setUsername}
                        placeholder ="Seu nome"
                        autoCapitalize="none"
                    />

                    <CustomTextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@exemplo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <CustomTextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mínimo de 6 caracteres"
                        secureTextEntry
                    />

                    <CustomTextInput
                        label="Confirmação de Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repita a senha"
                        secureTextEntry
                    />

                    <CustomButton
                        title={loading? "Cadastrando..." : "Cadastrar"}
                        onPress={handleSubmit}
                        disabled={loading}
                        style={{ marginTop: 20 }}
                    />
                </FormWrapper>
            </KeyboardAwareScrollView>
        </ScreenContainer>
    );
};

export default CadastroScreen;