import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import CustomButton from '../components/Global/CustomButton';
import { createUser } from '../services/UserService';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';



const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${COLORS.background};
    padding: 24px;
`;

const TopSection = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 40px;
`;

const UserInfoContainer = styled.View`
    margin-left: 20px;
`;

const UserInfoText = styled.Text`
    font-size: 16px;
    color: ${COLORS.textLight};
    margin-bottom: 5px;
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
  margin-bottom: 40px;
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
                <UserInfoContainer>
                    {/*Carregar com dados reais usando função getUser()*/}
                    <UserInfoText>Username: Gabriel</UserInfoText>
                    <UserInfoText>Altura: 1.80m</UserInfoText>
                    <UserInfoText>Peso: 80kg</UserInfoText>
                </UserInfoContainer>
            </TopSection>
        </ScreenContainer>
    );
};

export default UserScreen;