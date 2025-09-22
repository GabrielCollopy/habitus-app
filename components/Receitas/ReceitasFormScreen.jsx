import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { postReceita, updateReceita } from '../../services/ReceitasService';
import CustomButton from '../Global/CustomButton';

const ReceitasFormScreen = ({ route, navigation}) => {
    const receitaExistente = route.params?.receita;

    const [nome, setNome] = useState(receitaExistente?.nome || '');
    const [etapas, setEtapas] = useState(receitaExistente?.etapas || '');
    const [ingredientes, setIngredientes] = useState(receitaExistente?.ingredientes || '');
    const [link, setLink] = useState(receitaExistente?.link || '');

    const handleSubmit = async () => {
        try {
            if (receitaExistente) {
                await updateReceita(Number(receitaExistente.id), { nome, etapas, ingredientes, link });
                setNome('');
                setEtapas('');
                setIngredientes('');
                setLink('');
                Alert.alert("Sucesso", "Receita atualizada com sucesso!");
            } else {
                await postReceita({ nome, etapas, ingredientes, link });
                setNome('');
                setEtapas('');
                setIngredientes('');
                setLink('');
                Alert.alert("Sucesso", "Receita criada com sucesso!");
            }
            navigation.goBack();
        } catch (err) {
            console.error("Erro ao criar receita:", err);
            Alert.alert("Erro", "Não foi possível criar a receita.");
        }
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome da receita"
                placeholderTextColor='#ffffffff'
            />
            <Text style={styles.label}>Etapas:</Text>
            <TextInput
                style={styles.textarea}
                value={etapas}
                onChangeText={setEtapas}
                placeholder="Descreva as etapas"
                placeholderTextColor='#ffffffff'
                multiline
            />
            <Text style={styles.label}>Ingredientes:</Text>
            <TextInput
                style={styles.textarea}
                value={ingredientes}
                onChangeText={setIngredientes}
                placeholder="Liste os ingredientes"
                placeholderTextColor='#ffffffff'
                multiline
            />
            <Text style={styles.label}>Link:</Text>
            <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="Link (opcional)"
                placeholderTextColor='#ffffffff'
                keyboardType="url"
            />
            <CustomButton title="Adicionar Receita" onPress={handleSubmit} />
        </View>
    );
};


const styles = StyleSheet.create({
    form: {
        margin: 24,
        marginTop: 100,
        alignContent: 'center',
        backgroundColor: '#005c0c69',
        borderRadius: 16,
        padding: 16,
    },
    label: {
        fontWeight: 'bold',
        margin: 8,
        color: '#ffffffff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ffffffff',
        borderRadius: 4,
        padding: 8,
        margin: 8,
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#ffffffff',
        borderRadius: 4,
        padding: 8,
        margin: 8,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    placeholder: {
        color: '#ffffffa1',
    }
});

export default ReceitasFormScreen;