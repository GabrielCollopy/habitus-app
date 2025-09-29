import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { postReceita, updateReceita } from '../../services/ReceitasService';
import CustomButton from '../Global/CustomButton';
import CustomTextInput from '../Global/CustomTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Novo import
import styled from 'styled-components/native';

const FormContainer = styled.View`
    margin: 24px;
    margin-top: 50px; /* Ajuste para espaçamento superior */
    background-color: #005c0c69; 
    border-radius: 16px;
    padding: 16px;
    justify-content: center;
`;

const ReceitasFormScreen = ({ route, navigation }) => {
    const receitaExistente = route.params?.receita;
    const isEditing = !!receitaExistente;

    const [nome, setNome] = useState(receitaExistente?.nome || '');
    const [etapas, setEtapas] = useState(receitaExistente?.etapas || '');
    const [ingredientes, setIngredientes] = useState(receitaExistente?.ingredientes || '');
    const [link, setLink] = useState(receitaExistente?.link || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (isEditing) {
                await updateReceita(Number(receitaExistente.id), { nome, etapas, ingredientes, link });
                Alert.alert("Sucesso", "Receita atualizada com sucesso!");
            } else {
                await postReceita({ nome, etapas, ingredientes, link });
                Alert.alert("Sucesso", "Receita criada com sucesso!");
            }
            setNome(''); setEtapas(''); setIngredientes(''); setLink('');
            navigation.goBack();
        } catch (err) {
            console.error("Erro ao criar receita:", err);
            Alert.alert("Erro", "Não foi possível criar a receita.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: 'transparent' }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <FormContainer>
                <CustomTextInput
                    label="Nome:"
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome da receita"
                />

                <CustomTextInput
                    label="Etapas:"
                    value={etapas}
                    onChangeText={setEtapas}
                    placeholder="Descreva as etapas"
                    multiline
                />

                <CustomTextInput
                    label="Ingredientes:"
                    value={ingredientes}
                    onChangeText={setIngredientes}
                    placeholder="Liste os ingredientes"
                    multiline
                />

                <CustomTextInput
                    label="Link:"
                    value={link}
                    onChangeText={setLink}
                    placeholder="Link (opcional)"
                    keyboardType="url"
                />

                <CustomButton
                    title={isEditing ? "Salvar Edição" : "Adicionar Receita"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                />
            </FormContainer>
        </KeyboardAwareScrollView>

    );
};

export default ReceitasFormScreen;