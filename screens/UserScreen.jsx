import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import CustomButton from '../components/Global/CustomButton';
import { getAuthenticatedUser } from '../services/UserService';
import { logout } from '../services/AuthService';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';



const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${COLORS.background};
    padding: 24px;
`;

const TopSection = styled.View`
    align-items: center;
    margin-bottom: 40px;
`;

const UserInfoContainer = styled.View`
    align-itens: center;
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    background-color: ${COLORS.cardBackground};
`;

const UserInfoText = styled.Text`
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: ${COLORS.textLight};
    margin-bottom: 5px;
`;

const UsernameText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: ${COLORS.textLight};
    margin-top: 10px;
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

const LogoArea = styled.View`
  align-items: left;
  margin-top: 40px;
`;

const UserDetails = styled.Text`
    font-size: 18px;
    color: ${COLORS.textLight};
    border-radius: 12px;
    background-color: ${COLORS.cardBackground};
    margin-bottom: 10px;
`;

const Subtitle = styled.Text`
    color: ${COLORS.textLight};
    text-align: center;
    margin-bottom: 20px;
`;


const UserScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAuthenticatedUser();
                setUserData(data);
            } catch (error) {
                setError("Não foi possível carregar os dados do usuário.");
                console.error("Erro ao carregar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await logout(navigation);
    }

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
    }

    return (
        <ScreenContainer>

            <TopSection>
                <LogoArea>
                    {/* Ícone do Logo */}
                    <Ionicons
                        name="person-circle-outline"
                        size={80}
                        color={COLORS.primary}
                    />
                </LogoArea>
                <UsernameText>{userData.username}</UsernameText>
            </TopSection>

            <UserInfoContainer>
                {/*Carregar com dados reais usando função getUser()*/}
                <UserInfoText>Email:</UserInfoText>
                <CustomTextInput
                    value={userData.email}
                    editable={false}
                />

                <UserInfoText>Altura:</UserInfoText>
                <CustomTextInput
                    value={userData.altura || 'Não Informado'}
                    editable={false}
                />

                <UserInfoText>Peso:</UserInfoText>
                <CustomTextInput
                    value={userData.peso || 'Não Informado'}
                    editable={false}
                />
            </UserInfoContainer>

            <CustomButton
                title="Sair (Logout)"
                onPress={handleLogout}
                style={{ backgroundColor: '#c0392b', alignSelf: 'center' }}
            />
        </ScreenContainer>
    );
};

export default UserScreen;