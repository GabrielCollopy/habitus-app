import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../components/Global/CustomTextInput';
import { getAuthenticatedUser, updateUser, deleteUser } from '../services/UserService';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';
import { useTheme, THEMES } from '../services/ThemeContext';
import CustomButton from '../components/Global/CustomButton';
import UserReceitasList from '../components/User/UserReceitasList';
import FavoriteReceitasList from '../components/User/FavoriteReceitasList';
import ImcClassification from '../components/User/ImcClassification';

const ScreenContainer = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.background};
    padding: 24px;
`;

const TopSection = styled.View`
    align-items: center;
    margin-bottom: 20px;
`;

const LogoArea = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfoContainer = styled.View`
    padding: 20px;
    border-radius: 12px;
    background-color: ${props => props.theme.cardBackground};
    margin-bottom: 20px;
`;

const FieldContainer = styled.View`
    margin-bottom: 15px;
`;

const FieldLabel = styled.Text`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 5px;
`;

const UsernameText = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.theme.textLight};
`;

const ActionsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
`;

const ActionButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: ${props => props.color || props.theme.primary};
`;

const ActionButtonText = styled.Text`
    color: ${props => props.textColor || props.theme.textLight};
    margin-left: 8px;
    font-weight: bold;
`;

const ViewSelectorContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-bottom: 20px;
    background-color: ${props => props.theme.cardBackground};
    border-radius: 10px;
    padding: 4px;
`;

const SelectorButton = styled.TouchableOpacity`
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: ${props => props.active ? props.theme.primary : 'transparent'};
`;

const SelectorButtonText = styled.Text`
    color: ${props => props.active ? props.theme.accent : props.theme.textLight};
    font-weight: bold;
    text-align: center;
`;

const SectionTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.textLight};
    margin-bottom: 15px;
`;

const ThemeOption = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    background-color: ${props => props.selected ? props.theme.primary + '20' : 'transparent'};
    margin-bottom: 8px;
    border-width: 1px;
    border-color: ${props => props.selected ? props.theme.primary : props.theme.border};
`;

const ThemeText = styled.Text`
    color: ${props => props.selected ? props.theme.primary : props.theme.textLight};
    ${props => props.selected && props.theme.primaryTextShadow && `
        text-shadow-color: ${props.theme.primaryTextShadow.textShadowColor};
        text-shadow-offset: ${props.theme.primaryTextShadow.textShadowOffset.width}px ${props.theme.primaryTextShadow.textShadowOffset.height}px;
        text-shadow-radius: ${props.theme.primaryTextShadow.textShadowRadius}px;
    `}
    margin-left: 10px;
    font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const UserScreen = () => {
    const { logout } = useAuth();
    const { theme, colors, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ email: '', altura: '', peso: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('dados'); // 'dados', 'receitas', 'favoritas', 'tema'

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
            const updatedData = {
                ...formData,
                altura: formData.altura ? parseFloat(String(formData.altura).replace(',', '.')) : null,
                peso: formData.peso ? parseFloat(String(formData.peso).replace(',', '.')) : null,
            };

            const response = await updateUser(userData.id, updatedData);
            setUserData(response);
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
        setFormData({ email: userData.email, altura: userData.altura || '', peso: userData.peso || '' });
        setIsEditing(false);
    };

    const handleNavigateToCreate = () => {
        navigation.navigate('Receitas', { screen: 'ReceitasForm' });
    };

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    if (error) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}><Text style={{ color: colors.danger }}>{error}</Text></View>;
    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <ScreenContainer theme={{ ...colors }}>
                <TopSection>
                    <LogoArea>
                        <Ionicons
                            name="person-circle-outline"
                            size={80}
                            color={colors.primary}
                        />
                    </LogoArea>
                    <UsernameText theme={{ ...colors }}>{userData.username}</UsernameText>
                </TopSection>

                <ViewSelectorContainer theme={{ ...colors }}>
                    <SelectorButton theme={{ ...colors }} active={activeView === 'dados'} onPress={() => setActiveView('dados')}>
                        <SelectorButtonText theme={{ ...colors }} active={activeView === 'dados'}>Perfil</SelectorButtonText>
                    </SelectorButton>
                    <SelectorButton theme={{ ...colors }} active={activeView === 'receitas'} onPress={() => setActiveView('receitas')}>
                        <SelectorButtonText theme={{ ...colors }} active={activeView === 'receitas'}>Receitas</SelectorButtonText>
                    </SelectorButton>
                    <SelectorButton theme={{ ...colors }} active={activeView === 'favoritas'} onPress={() => setActiveView('favoritas')}>
                        <SelectorButtonText theme={{ ...colors }} active={activeView === 'favoritas'}>Favoritos</SelectorButtonText>
                    </SelectorButton>
                    <SelectorButton theme={{ ...colors }} active={activeView === 'tema'} onPress={() => setActiveView('tema')}>
                        <SelectorButtonText theme={{ ...colors }} active={activeView === 'tema'}>Tema</SelectorButtonText>
                    </SelectorButton>
                </ViewSelectorContainer>

                {activeView === 'dados' && (
                    <>
                        <UserInfoContainer theme={{ ...colors }}>
                            <FieldContainer>
                                <FieldLabel theme={{ ...colors }}>Email:</FieldLabel>
                                <CustomTextInput
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <FieldLabel theme={{ ...colors }}>Altura (m):</FieldLabel>
                                <CustomTextInput
                                    value={String(formData.altura)}
                                    onChangeText={(value) => handleInputChange('altura', value)}
                                    placeholder="Ex: 1.75"
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <FieldLabel theme={{ ...colors }}>Peso (kg):</FieldLabel>
                                <CustomTextInput
                                    value={String(formData.peso)}
                                    onChangeText={(value) => handleInputChange('peso', value)}
                                    placeholder="Ex: 70.5"
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            </FieldContainer>
                            <FieldContainer>
                                <FieldLabel theme={{ ...colors }}>Índice de Massa Corporal (IMC):</FieldLabel>
                                <CustomTextInput
                                    value={userData.imc ? String(userData.imc.toFixed(2)) : 'N/A'}
                                    editable={false}
                                />
                            </FieldContainer>
                        </UserInfoContainer>

                        <ImcClassification imc={userData?.imc} />

                        <ActionsContainer>
                            {isEditing ? (
                                <>
                                    <ActionButton color={colors.success} onPress={handleUpdate}>
                                        <Ionicons name="save-outline" size={20} color={colors.textLight} />
                                        <ActionButtonText theme={{ ...colors }}>Salvar</ActionButtonText>
                                    </ActionButton>
                                    <ActionButton color={colors.danger} onPress={handleCancelEdit} style={{ marginLeft: 15 }}>
                                        <Ionicons name="close-circle-outline" size={20} color={colors.textLight} />
                                        <ActionButtonText theme={{ ...colors }}>Cancelar</ActionButtonText>
                                    </ActionButton>
                                </>
                            ) : (
                                <ActionButton theme={{ ...colors }} color={colors.cardBackground} onPress={() => setIsEditing(true)} style={{ borderWidth: 1, borderColor: colors.accent }}>
                                    <Ionicons name="create-outline" size={20} color={colors.accent} />
                                    <ActionButtonText theme={{ ...colors }} textColor={colors.accent}>Editar Dados</ActionButtonText>
                                </ActionButton>
                            )}
                        </ActionsContainer>
                    </>
                )}

                {activeView === 'receitas' && (
                    <>
                        <CustomButton
                            title="Criar Nova Receita"
                            onPress={handleNavigateToCreate}
                            icon={<Ionicons name="add-circle-outline" size={20} color={colors.accent} />}
                            textColor={colors.accent}
                            style={{ marginBottom: 20 }}
                        />
                        <UserReceitasList />
                    </>
                )}

                {activeView === 'favoritas' && (
                    <FavoriteReceitasList />
                )}

                {activeView === 'tema' && (
                    <UserInfoContainer theme={{ ...colors }}>
                        <SectionTitle theme={{ ...colors }}>Aparência do App</SectionTitle>
                        <ThemeOption
                            theme={{ ...colors }}
                            selected={theme === THEMES.DEFAULT}
                            onPress={() => toggleTheme(THEMES.DEFAULT)}
                        >
                            <Ionicons name="phone-portrait-outline" size={20} color={theme === THEMES.DEFAULT ? colors.primary : colors.textLight} />
                            <ThemeText theme={{ ...colors }} selected={theme === THEMES.DEFAULT}>Padrão (Original)</ThemeText>
                        </ThemeOption>
                        <ThemeOption
                            theme={{ ...colors }}
                            selected={theme === THEMES.LIGHT}
                            onPress={() => toggleTheme(THEMES.LIGHT)}
                        >
                            <Ionicons name="sunny-outline" size={20} color={theme === THEMES.LIGHT ? colors.primary : colors.textLight} />
                            <ThemeText theme={{ ...colors }} selected={theme === THEMES.LIGHT}>Claro</ThemeText>
                        </ThemeOption>
                        <ThemeOption
                            theme={{ ...colors }}
                            selected={theme === THEMES.DARK}
                            onPress={() => toggleTheme(THEMES.DARK)}
                        >
                            <Ionicons name="moon-outline" size={20} color={theme === THEMES.DARK ? colors.primary : colors.textLight} />
                            <ThemeText theme={{ ...colors }} selected={theme === THEMES.DARK}>Escuro</ThemeText>
                        </ThemeOption>
                    </UserInfoContainer>
                )}

                <View style={{ marginTop: 20, paddingTop: 20 }}>
                    <CustomButton
                        title="Sair"
                        onPress={logout}
                        secondary
                        borderColor={colors.danger}
                        textColor={colors.danger}
                    />
                </View>
            </ScreenContainer>
        </KeyboardAwareScrollView>
    );
};

export default UserScreen;