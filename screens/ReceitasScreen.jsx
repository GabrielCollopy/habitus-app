import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import ReceitasList from '../components/Receitas/ReceitasList';
import { COLORS } from '../constants/Colors';

const SearchBar = styled.TextInput`
  height:45px;
  background-color: ${COLORS.cardBackground};
  color: ${COLORS.textLight};
  border-radius: 8px;
  padding-horizontal: 15px;
  font-size: 16px;
  margin-bottom: 15px;
  `;

const ReceitasScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.buttonWrapper}>
                <SearchBar
                    placeholder="Buscar receita pelo nome..."
                    placeholderTextColor={`${COLORS.textLight}80`} // Cor com opacidade
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    returnKeyType="search"
                    // Limpa o campo ao pressionar o 'x' (iOS) ou o botão de limpar (Android)
                    clearButtonMode="while-editing" 
                />
            </View>
            <ReceitasList searchTerm={searchTerm} />
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