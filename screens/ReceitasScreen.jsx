import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ReceitasList from '../components/Receitas/ReceitasList';
import CustomButton from '../components/Global/CustomButton';
import { COLORS } from '../constants/Colors';

const ReceitasScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setRefreshTrigger(prev => !prev);
        }
    }, [isFocused]);


    return (
        <View style={styles.container}>
            <View style={styles.buttonWrapper}>
                <CustomButton
                    title="Adicionar Receita"
                    onPress={() => navigation.navigate('ReceitasForm')}
                />
            </View>
            <ReceitasList refreshTrigger={refreshTrigger} /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    buttonWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.background,
    },
});

export default ReceitasScreen;