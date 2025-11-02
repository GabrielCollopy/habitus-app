import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import { getAuthenticatedUser, updateUser } from '../services/UserService';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../constants/Colors';
import CustomButton from '../components/Global/CustomButton';
import UserReceitasList from '../components/User/UserReceitasList';


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
    margin-top: 20px; /* Adiciona espaçamento vertical acima dos botões */
`;

const ActionButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: ${props => props.color || COLORS.primary};
`;

const ActionButtonText = styled.Text`
    color: ${props => props.textColor || COLORS.textLight};
    margin-left: 8px;
    font-weight: bold;
`;

const BottomContainer = styled.View`
    margin-top: auto; /* Empurra para o final */
    padding-top: 20px;
`;

// Componentes para o seletor de abas
const ViewSelectorContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-bottom: 20px;
    background-color: ${COLORS.cardBackground};
    border-radius: 10px;
    padding: 4px;
`;

const SelectorButton = styled.TouchableOpacity`
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: ${props => props.active ? COLORS.primary : 'transparent'};
`;

const SelectorButtonText = styled.Text`
    color: ${props => props.active ? COLORS.accent : COLORS.textLight};
    font-weight: bold;
    text-align: center;
`;

const UserScreen = () => {
    const { logout } = useAuth();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ email: '', altura: '', peso: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('dados'); // 'dados' ou 'receitas'

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

    const handleNavigateToCreate = () => {
        navigation.navigate('Receitas', { screen: 'ReceitasForm' });
    };

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (error) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}><Text style={{ color: COLORS.danger }}>{error}</Text></View>;
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

                <ViewSelectorContainer>
                    <SelectorButton active={activeView === 'dados'} onPress={() => setActiveView('dados')}>
                        <SelectorButtonText active={activeView === 'dados'}>Meus Dados</SelectorButtonText>
                    </SelectorButton>
                    <SelectorButton active={activeView === 'receitas'} onPress={() => setActiveView('receitas')}>
                        <SelectorButtonText active={activeView === 'receitas'}>Minhas Receitas</SelectorButtonText>
                    </SelectorButton>
                </ViewSelectorContainer>

                {activeView === 'dados' ? (
                    <>
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
                                    <ActionButton color={COLORS.success} onPress={handleUpdate}>
                                        <Ionicons name="save-outline" size={20} color={COLORS.textLight} />
                                        <ActionButtonText>Salvar</ActionButtonText>
                                    </ActionButton>
                                    <ActionButton color={COLORS.danger} onPress={handleCancelEdit} style={{ marginLeft: 15, marginTop: 0 }}>
                                        <Ionicons name="close-circle-outline" size={20} color={COLORS.textLight} />
                                        <ActionButtonText>Cancelar</ActionButtonText>
                                    </ActionButton>
                                </>
                            ) : (
                                <ActionButton onPress={() => setIsEditing(true)}>
                                    <Ionicons name="create-outline" size={20} color={COLORS.accent} />
                                    <ActionButtonText textColor={COLORS.accent}>Editar Dados</ActionButtonText>
                                </ActionButton>
                            )}
                        </ActionsContainer>
                    </>
                ) : (
                    <>
                        <CustomButton
                            title="Criar Nova Receita"
                            onPress={handleNavigateToCreate}
                            icon={<Ionicons name="add-circle-outline" size={20} color={COLORS.accent} />}
                            textColor={COLORS.accent}
                            style={{ marginBottom: 20 }}
                        />
                        <UserReceitasList />
                    </>
                )}

                <BottomContainer>
                    <CustomButton
                        title="Sair"
                        onPress={logout}
                        secondary // Usa o estilo de borda
                        borderColor={COLORS.danger} // Passa a cor da borda
                        textColor={COLORS.danger}
                    />
                </BottomContainer>
            </ScreenContainer>
        </KeyboardAwareScrollView>
    );
};

export default UserScreen;