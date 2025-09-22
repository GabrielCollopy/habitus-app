import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ReceitasList from '../components/Receitas/ReceitasList';
import CustomButton from '../components/Global/CustomButton';

const ReceitasScreen = () => {
    const [atualizarLista, setAtualizarLista] = useState(false);
    const navigation = useNavigation();

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setAtualizarLista(prev => !prev);
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <CustomButton
                title="Adicionar Receita"
                onPress={() => navigation.navigate('ReceitasForm')}
            />
            <ReceitasList atualizar={atualizarLista} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
});

export default ReceitasScreen;