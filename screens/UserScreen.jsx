import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import CustomButton from '../components/Global/CustomButton';
import { getAuthenticatedUser, updateUser } from '../services/UserService';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../constants/Colors';


const ScreenContainer = styled.SafeAreaView`
    flex: 1;
    background-color: ${COLORS.background};
    padding: 24px;
`;

const TopSection = styled.View`
    align-items: center;
    margin-bottom: 40px;
`;

const LogoArea = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfoContainer = styled.View`
    padding: 20px;
    border-radius: 12px;
    background-color: ${COLORS.cardBackground};
`;

const FieldContainer = styled.View`
    margin-bottom: 15px;
`;

const FieldLabel = styled.Text`
    font-size: 14px;
    color: ${COLORS.textLight};
    margin-bottom: 5px;
`;

const UsernameText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: ${COLORS.textLight};
`;

const ActionsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const ActionButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: ${props => props.color || COLORS.primary};
`;

const ActionButtonText = styled.Text`
    color: white;
    margin-left: 8px;
    font-weight: bold;
`;

const BottomContainer = styled.View`
    margin-top: auto; /* Empurra para o final */
    padding-top: 20px;
`;


const UserScreen = () => {
    const { logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ email: '', altura: '', peso: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAuthenticatedUser();
                setUserData(data);
                setFormData({ email: data.email, altura: data.altura || '', peso: data.peso || '' });
            } catch (error) {
                setError("Não foi possível carregar os dados do usuário.");
                console.error("Erro ao carregar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);


    const handleUpdate = async () => {
        if (!userData?.id) return;

        setLoading(true);
        try {
            // Prepara os dados, convertendo para números se necessário
            const updatedData = {
                ...formData,
                altura: formData.altura ? parseFloat(String(formData.altura).replace(',', '.')) : null,
                peso: formData.peso ? parseFloat(String(formData.peso).replace(',', '.')) : null,
            };

            const response = await updateUser(userData.id, updatedData);
            setUserData(response); // Atualiza os dados principais com a resposta do servidor
            // Atualiza o formulário com os dados que acabaram de ser salvos
            setFormData({ email: response.email, altura: response.altura || '', peso: response.peso || '' });
            setIsEditing(false);
            Alert.alert("Sucesso", "Dados atualizados com sucesso!");
        } catch (err) {
            Alert.alert("Erro", "Não foi possível atualizar os dados.");
            console.error("Erro ao atualizar usuário:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        // Restaura os dados do formulário para os dados originais do usuário
        setFormData({ email: userData.email, altura: userData.altura || '', peso: userData.peso || '' });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: COLORS.background }} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <ScreenContainer>
                <TopSection>
                    <LogoArea>
                        <Ionicons
                            name="person-circle-outline"
                            size={80}
                            color={COLORS.primary}
                        />
                    </LogoArea>
                    <UsernameText>{userData.username}</UsernameText>
                </TopSection>

                <UserInfoContainer>
                    <FieldContainer>
                        <FieldLabel>Email:</FieldLabel>
                        <CustomTextInput
                            value={formData.email}
                            onChangeText={(value) => handleInputChange('email', value)}
                            editable={isEditing}
                            keyboardType="email-address"
                        />
                    </FieldContainer>
                    <FieldContainer>
                        <FieldLabel>Altura (m):</FieldLabel>
                        <CustomTextInput
                            value={String(formData.altura)}
                            onChangeText={(value) => handleInputChange('altura', value)}
                            placeholder="Ex: 1.75"
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </FieldContainer>
                    <FieldContainer>
                        <FieldLabel>Peso (kg):</FieldLabel>
                        <CustomTextInput
                            value={String(formData.peso)}
                            onChangeText={(value) => handleInputChange('peso', value)}
                            placeholder="Ex: 70.5"
                            editable={isEditing}
                            keyboardType="numeric"
                        />
                    </FieldContainer>
                    <FieldContainer>
                        <FieldLabel>Índice de Massa Corporal (IMC):</FieldLabel>
                        <CustomTextInput
                            value={userData.imc ? String(userData.imc.toFixed(2)) : 'N/A'}
                            editable={false}
                        />
                    </FieldContainer>
                </UserInfoContainer>

                <ActionsContainer>
                    {isEditing ? (
                        <>
                            <ActionButton color="#27ae60" onPress={handleUpdate}>
                                <Ionicons name="save-outline" size={20} color="white" />
                                <ActionButtonText>Salvar</ActionButtonText>
                            </ActionButton>
                            <ActionButton color="#e74c3c" onPress={handleCancelEdit}>
                                <Ionicons name="close-circle-outline" size={20} color="white" />
                                <ActionButtonText>Cancelar</ActionButtonText>
                            </ActionButton>
                        </>
                    ) : (
                        <ActionButton onPress={() => setIsEditing(true)}>
                            <Ionicons name="create-outline" size={20} color="white" />
                            <ActionButtonText>Editar Dados</ActionButtonText>
                        </ActionButton>
                    )}
                </ActionsContainer>

                <BottomContainer>
                    <CustomButton
                        title="Sair"
                        onPress={logout}
                        secondary
                    />
                </BottomContainer>
            </ScreenContainer>
        </KeyboardAwareScrollView>
    );
};

export default UserScreen;